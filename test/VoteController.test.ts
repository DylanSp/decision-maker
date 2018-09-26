import * as express from "express";
import { Right } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";
import { isEqual } from "lodash";
import "reflect-metadata";
import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { createConnection } from "typeorm";

import { VoteCreationResponse, VoteSummaryResponse } from "../io-types/VotePayloads";

import { Choice } from "../src/entity/Choice";
import { Vote } from "../src/entity/Vote";
import { ChoiceRepository } from "../src/repository/ChoiceRepository";
import { VoteRepository } from "../src/repository/VoteRepository";
import { DecisionMakerServer } from "../src/server";

const version = "v0.1";
const routePrefix = "/api/" + version;
const testSalt = "salty!";

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

    it("returns a list of open votes on GET /votes", async (done) => {
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

    it("creates a new Vote when POSTing to /vote", async (done) => {
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
        .expect("Content-Type", /json/)
        .expect("Location", /\/votes\/(.+)/) // should return "/votes/:voteid"
        .expect(201)

        // validate response structure
        // TODO - can I do this with io-ts?
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
        .then(async () => {
            const numAfterPost = (await voteRepo.findAndCount())[1];
            expect(numAfterPost).toBe(1);
            done();
        });
    });

    it("creates associated choices when POSTing to /vote", () => {
        // can't check id, so check that choices are linked to vote somehow?
    });
});