import * as express from "express";
import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { createConnection } from "typeorm";

import { Vote } from "../src/entity/Vote";
import { VoteRepository } from "../src/repository/VoteRepository";
import { DecisionMakerServer } from "../src/server";

const version = "v0.1";
const routePrefix = "/api/" + version;

let voteRepo: VoteRepository;
let app: express.Express;

beforeAll(async (done) => {
    const conn = await createConnection("test");
    voteRepo = conn.getCustomRepository(VoteRepository);
    app = new DecisionMakerServer(voteRepo).app;
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
        await voteRepo.save(vote0);

        const vote1 = new Vote();
        vote1.name = "Open vote 1";
        vote1.isOpen = true;
        await voteRepo.save(vote1);

        const vote2 = new Vote();
        vote2.name = "Closed vote 2";
        vote2.isOpen = false;
        await voteRepo.save(vote2);

        request.get(routePrefix + "/votes")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res: supertest.Response) => {
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
});