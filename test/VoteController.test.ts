import * as express from "express";
import { Right } from "fp-ts/lib/Either";
import Hashids from "hashids";
import { PathReporter } from "io-ts/lib/PathReporter";
import { isEqual } from "lodash";
import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { createConnection } from "typeorm";

import { VoteCreationResponse, VoteDetailsResponse, VoteSummaryResponse } from "../io-types/VotePayloads";

import { Choice } from "../src/entity/Choice";
import { Vote } from "../src/entity/Vote";
import { ChoiceRepository } from "../src/repository/ChoiceRepository";
import { VoteRepository } from "../src/repository/VoteRepository";
import { DecisionMakerServer } from "../src/server";


const version = "v0.1";
const routePrefix = "/api/" + version;
const testSalt = "salty!";

// these settings should mirror VoteController
// TODO - factor out into shared module?
const hashidMinLength = 5;
const idAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const hashids = new Hashids(testSalt, hashidMinLength, idAlphabet);

let voteRepo: VoteRepository;
let choiceRepo: ChoiceRepository;
let app: express.Express;

// TODO - utility function for validating response, given an io-ts type?

beforeAll(async (done) => {
    const conn = await createConnection("test");
    voteRepo = conn.getCustomRepository(VoteRepository);
    choiceRepo = conn.getCustomRepository(ChoiceRepository);
    app = new DecisionMakerServer(voteRepo, choiceRepo, testSalt).app;
    done();
});

beforeEach(async (done) => {
    // make sure to clean up choices before votes, to comply with FK constraint
    await choiceRepo
        .createQueryBuilder()
        .delete()
        .from(Choice)
        .execute();
    await voteRepo
        .createQueryBuilder()
        .delete()
        .from(Vote)
        .execute();    
    done();
});

describe("Vote controller", () => {
    let request: SuperTest<supertest.Test>;

    beforeEach(() => {
        request = supertest(app);
    });

    describe("GET /votes", () => {
        it("returns a list of open votes", async (done) => {
            const vote0 = new Vote();
            vote0.name = "Open vote 0";
            vote0.isOpen = true;
            vote0.numVoters = 5;
            vote0.password = "pass";
            vote0.choices = [new Choice("choice0")];
            await voteRepo.save(vote0);
    
            const vote1 = new Vote();
            vote1.name = "Open vote 1";
            vote1.isOpen = true;
            vote1.numVoters = 10;
            vote1.password = "pass";
            vote1.choices = [new Choice("choice1")];
            await voteRepo.save(vote1);
    
            const vote2 = new Vote();
            vote2.name = "Closed vote 2";
            vote2.isOpen = false;
            vote2.numVoters = 150;
            vote2.password = "pass";
            vote2.choices = [new Choice("choice2")];
            await voteRepo.save(vote2);
    
            request.get(routePrefix + "/votes")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                const response = VoteSummaryResponse.decode(res.body);
    
                if(response instanceof Right) {
                    const votes = response.value;
                    // expect to find vote 0
                    if(!(votes.find(vote => vote.name === "Open vote 0"))) {
                        throw new Error("missing vote 0");
                    }
    
                    // expect to find vote 1
                    if(!(votes.find(vote => vote.name === "Open vote 1"))) {
                        throw new Error("missing vote 1");
                    }
    
                    // expect NOT to find vote2
                    if ((votes.find(obj => obj.name === "Closed vote 2"))) {
                        throw new Error("Vote 2 present");
                    }
    
                    // check that hashids are all purely alphabetical
                    if (votes.some(vote => !(/[a-zA-Z]/.test(vote.hashid)))) {
                        throw new Error("Vote with non-alphabetic hashid");
                    }
                } else { // decoding failed
                    throw new Error(PathReporter.report(response).toString());
                }
            })
            .end(done);
        });
    });
    
    describe("POST /votes", () => {
        it("creates a new vote in the database", async (done) => {
            const numBeforePost = (await voteRepo.findAndCount())[1];
            expect(numBeforePost).toBe(0);

            const payload = {
                name: "test vote",
                numVoters: 2,
                choices: [
                    "Bush",
                    "Gore",
                    "Nader"
                ],
                password: "testPass"
            };

            request.post(routePrefix + "/votes")
            .send(payload)
            .then(async () => {
                const numAfterPost = (await voteRepo.findAndCount())[1];
                expect(numAfterPost).toBe(1);
                done();
            });
        });

        it("returns a description of the newly created vote", (done) => {
            const payload = {
                name: "test vote",
                numVoters: 2,
                choices: [
                    "Bush",
                    "Gore",
                    "Nader"
                ],
                password: "testPass"
            };
    
            request.post(routePrefix + "/votes")
            .send(payload)
            .expect("Content-Type", /json/)
            .expect("Location", /\/votes\/(.+)/) // should return "/votes/:voteid"
            .expect(201)
    
            // validate response structure
            .expect((res) => {
                const response = VoteCreationResponse.decode(res.body);
    
                if(response instanceof Right) {
                    const { hashid, isOpen, choices:responseChoices, ...createdVote } = response.value;
    
                    if(!isOpen) {
                        throw new Error("New vote is not open");
                    }
    
                    if(!(/[a-zA-Z]+/.test(hashid))) {
                        throw new Error(`hashid contains invalid chars; received ${hashid}`);
                    }
    
                    if(!res.get("Location").includes(hashid)) {
                        throw new Error(`hashid doesn't match Location header; hashid was ${hashid}, Location header was ${res.get("Location")}`);
                    }
    
                    const { choices:payloadChoices, ...payloadWithoutChoices } = payload;
                    if(!isEqual(createdVote, payloadWithoutChoices)) {
                        throw new Error(`Mismatch between name, numVoters, or password between request and response:
created: ${JSON.stringify(createdVote)}
payload: ${JSON.stringify(payloadWithoutChoices)}`
                        );
                    }
    
                    // use sort() so we don't worry about what order choices are returned in
                    if(!isEqual(responseChoices.sort(), payloadChoices.sort())) {
                        throw new Error("Mismatch in choices between request and response");
                    }
                } else { // decoding failed
                    throw new Error(PathReporter.report(response).toString());
                }
            })
            .end(done);
        });

        it("creates associated choices", async (done) => {
            const numBeforePost = (await choiceRepo.findAndCount())[1];
            expect(numBeforePost).toBe(0);

            const payload = {
                name: "test vote",
                numVoters: 2,
                choices: [
                    "Bush",
                    "Gore",
                    "Nader"
                ],
                password: "testPass"
            };

            request.post(routePrefix + "/votes")
            .send(payload)
            .then(async () => {
                const [ choices, numAfterPost ] = (await choiceRepo.findAndCount());
                expect(choices.map(choice => choice.name).sort()).toEqual(payload.choices.sort());
                expect(numAfterPost).toBe(3);
                done();
            });
        });

        describe("validates incoming requests", () => {
            it("requires that request.name exists", (done) => {
                const payload = {
                    numVoters: 2,
                    choices: [
                        "Bush",
                        "Gore",
                        "Nader"
                    ],
                    password: "testPass"
                };
                request.post(routePrefix + "/votes")
                .send(payload)
                .expect(400, done);
            });

            it("requires that request.name is a string", (done) => {
                const payload = {
                    name: true,
                    numVoters: 2,
                    choices: [
                        "Bush",
                        "Gore",
                        "Nader"
                    ],
                    password: "testPass"
                };
                request.post(routePrefix + "/votes")
                .send(payload)
                .expect(400)
                .end(done);
            });

            // TODO - test other fields?
            // test that choices is nonempty
        });
    });

    describe("GET /votes/:voteid", () => {
        it("returns details on a requested vote", async (done) => {
            const choiceName = "choice";
            const vote = new Vote();
            vote.name = "Sample requested vote";
            vote.isOpen = true;
            vote.numVoters = 5;
            vote.password = "pass";
            vote.choices = [new Choice(choiceName)];
            // id needs to be transformed to hashid, choices needs to have names extracted
            const {id, choices, ...voteWithOtherProperties} = await voteRepo.save(vote);
            const hashid = hashids.encode(id);

            request.get(routePrefix + "/votes/" + hashid)
            .expect("Content-Type", /json/)
            .expect(200)
            .expect((res) => {
                const response = VoteDetailsResponse.decode(res.body);

                if(response instanceof Right) {
                    const returnedVote = response.value;
                    const expectedResponse = {
                        hashid,
                        choices: choices.map(choice => choice.name),
                        ...voteWithOtherProperties
                    };
                    // check vote details
                    if(!isEqual(returnedVote, expectedResponse)) {
                        throw new Error(`Returned details don't match inserted vote:
inserted: ${JSON.stringify(vote)}
expected: ${JSON.stringify(expectedResponse)}
returned: ${JSON.stringify(returnedVote)}`
                        );
                    }
                } else { // decoding failed
                    throw new Error(PathReporter.report(response).toString());
                }
            })
            .end(done);
        });

        it("includes the winner in details on a completed vote", async (done) => {
            const choiceName = "choice";
            const vote = new Vote();
            vote.name = "Sample completed vote";
            vote.isOpen = true;
            vote.numVoters = 5;
            vote.password = "pass";
            vote.choices = [new Choice(choiceName)];
            // id needs to be transformed to hashid, choices needs to have names extracted
            const {id, choices, ...voteWithOtherProperties} = await voteRepo.save(vote);
            const hashid = hashids.encode(id);

            await choiceRepo
            .createQueryBuilder()
            .update()
            .set({isWinner: true})
            .where("voteId = :id", {id})
            .execute();

            request.get(routePrefix + "/votes/" + hashid)
            .expect((res) => {
                const response = VoteDetailsResponse.decode(res.body);

                if(response instanceof Right) {
                    const returnedVote = response.value;
                    if(returnedVote.winner !== choiceName) {
                        console.log(returnedVote.winner);
                        throw new Error("Winning choice not returned");
                    }

                    /*
                    const expectedResponse = {
                        hashid,
                        choices: choices.map(choice => choice.name),
                        ...voteWithOtherProperties
                    };
                    // check vote details
                    if(!isEqual(returnedVote, expectedResponse)) {
                        throw new Error(`Returned details don't match inserted vote:
inserted: ${JSON.stringify(vote)}
expected: ${JSON.stringify(expectedResponse)}
returned: ${JSON.stringify(returnedVote)}`
                        );
                    }
                    */
                } else { // decoding failed
                    throw new Error(PathReporter.report(response).toString());
                }
            })
            .end(done);
        });
        
        it("returns a 404 when requesting a nonexistent vote", async (done) => {
            request.get(routePrefix + "/votes/abcde")
            .expect(404)
            .end(done);
        });
        
        it("returns a 404 when using a non-alphabetic voteid", async (done) => {
            request.get(routePrefix + "/votes/12345")
            .expect(404)
            .end(done);
        });

        
    });
});
