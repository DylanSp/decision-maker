import * as express from "express";
import { isEqual } from "lodash";
import "reflect-metadata";
import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { createConnection } from "typeorm";

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
            // expect to find vote0
            if (!(res.body.find(obj => obj.name === "Open vote 0"))) {
                throw new Error("missing vote 0");
            }

            // expect to find vote1
            if (!(res.body.find(obj => obj.name === "Open vote 1"))) {
                throw new Error("missing vote 1");
            }

            // expect NOT to find vote1
            if ((res.body.find(obj => obj.name === "Closed vote 2"))) {
                throw new Error("Vote 2 present");
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
            if(!res.body.hashid || !(/[a-zA-Z]+/.test(res.body.hashid))) {
                throw new Error(`hashid not present or contains invalid chars; received ${res.body.hashid}`);
            }

            if(!res.get("Location").includes(res.body.hashid)) {
                throw new Error(`hashid doesn't match Location header; hashid was ${res.body.hashid}, Location header was ${res.get("Location")}`);
            }

            if (!res.body.name || res.body.name !== payload.name) {
                throw new Error(`Name not present or incorrect; received ${res.body.name}`);
            }

            if(!res.body.numVoters || res.body.numVoters !== payload.numVoters) {
                throw new Error(`numVoters not present or incorrect; received ${res.body.numVoters}`);
            }

            // use sort() so we don't worry about what order choices are returned in
            if(!res.body.choices || isEqual(res.body.choices.sort(), payload.choices.sort())) {
                throw new Error(`Choices not present or incorrect; received ${res.body.choices}`);
            }

            if(!res.body.password) {
                throw new Error("Password not present");
            }
        })
        .then(async () => {
            const numAfterPost = (await voteRepo.findAndCount())[1];
            expect(numAfterPost).toBe(1);
            done();
        });
    });
});