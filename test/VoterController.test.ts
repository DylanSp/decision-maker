import { SuperTest } from "supertest";
import * as supertest from "supertest";
import { app } from "../src/server";


describe.skip("Voter controller", () => {
    let request: SuperTest<supertest.Test>;

    beforeEach(() => {
        request = supertest(app);
    });

    it("creates a new voter when POSTed to", (done) => {
        request.post("/voter")
        .expect("Content-Type", /json/)
        .end(done);
    });
});
