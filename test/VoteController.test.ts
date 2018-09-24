import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { Connection, createConnection } from "typeorm";
import { Vote } from "../src/entity/Vote";
import { app } from "../src/server";

const version = "v0.1";
const routePrefix = "/api/" + version;
let conn: Connection;

beforeAll(async () => {
    conn = await createConnection("test");
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
        // await vote0.save();
        await conn.getRepository(Vote).save(vote0);

        /*
        const vote1 = new Vote();
        vote1.name = "Open vote 1";
        vote1.isOpen = true;
        await vote1.save();

        const vote2 = new Vote();
        vote2.name = "Closed vote 2";
        vote2.isOpen = false;
        await vote2.save();
        */

        request.get(routePrefix + "/votes")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect((res: supertest.Response) => {
            if (!(res.body.find(obj => obj.name === "Open vote 0"))) {
                throw new Error("missing vote 0");
            }

            if (!(res.body.find(obj => obj.name === "Open vote 1"))) {
                throw new Error("missing vote 1");
            }
            
        })
        .end(done);
    });
});