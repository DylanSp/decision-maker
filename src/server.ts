import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as morgan from "morgan";
import { createVote, getVoteDetails, processBallot, summarizeAllVotes } from "./controller/VoteController";
import { createVoter } from "./controller/VoterController";

const version = "v0.1";

// create express app
const app = express();

// setup express app
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(compression());
app.set("port", process.env.PORT || 3001);

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

export { app };