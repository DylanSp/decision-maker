import "reflect-metadata";
import { createConnection } from "typeorm";
import { ChoiceRepository } from "./repository/ChoiceRepository";
import { VoteRepository } from "./repository/VoteRepository";
import { DecisionMakerServer } from "./server";

createConnection("prod").then(async (connection) => {
    const voteRepo = connection.getCustomRepository(VoteRepository);
    const choiceRepo = connection.getCustomRepository(ChoiceRepository);
    const app = new DecisionMakerServer(voteRepo, choiceRepo, "salt").app;

    // start express server
    const port = app.get("port");
    app.listen(port);
    console.log(`Express server has started on port ${port}.`);

}).catch((error) => console.log(error));
