import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as morgan from "morgan";
import { VoteController } from "./controller/VoteController";
import { createVoter } from "./controller/VoterController";
import { ChoiceRepository } from "./repository/ChoiceRepository";
import { VoteRepository } from "./repository/VoteRepository";

const version = "v0.1";

export class DecisionMakerServer {
    public readonly app: express.Express;

    public constructor(voteRepo: VoteRepository, choiceRepo: ChoiceRepository, hashidSalt: string) {
        this.app = express();

        // setup express app
        this.app.use(bodyParser.json());
        this.app.use(morgan("tiny"));
        this.app.use(compression());
        this.app.set("port", process.env.PORT || 3001);

        // set up routes
        const router = express.Router();

        // Vote controller
        const voteController = new VoteController(voteRepo, choiceRepo, hashidSalt);
        router.get("/votes", voteController.summarizeAllVotes);
        router.post("/votes", voteController.createVote);
        router.get("/votes/:voteid([a-zA-Z]+)", voteController.getVoteDetails);
        router.post("/votes/:voteid", voteController.processBallot);

        // Voter controller
        router.post("/voter", createVoter);

        this.app.use("/api/" + version, router);
    }
}
