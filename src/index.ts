import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import {User} from "./entity/User";
import { summarizeAllVotes, createVote, getVoteDetails, processBallot } from "./controller/VoteController";
import { createVoter } from "./controller/VoterController";

const version = "v0.1";
const port = process.env["PORT"] || 3001;

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // setup express app here
    app.use(morgan("tiny"));

    // set up routes
    const router = express.Router();

    // Vote controller
    router.get("/votes", summarizeAllVotes);
    router.post("/votes", createVote);
    router.get("/votes/:voteid", getVoteDetails);
    router.post("/votes/:voteid", processBallot);

    // Voter controller
    router.post("/voter", createVoter);

    app.use("/api/" + version, router);

    // start express server
    app.listen(port);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27
    }));
    await connection.manager.save(connection.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24
    }));

    console.log(`Express server has started on port ${port}. Open http://localhost:${port}/users to see results`);

}).catch(error => console.log(error));
