import "reflect-metadata";
import { createConnection } from "typeorm";
import { ChoiceRepository } from "./repository/ChoiceRepository";
import { VoteRepository } from "./repository/VoteRepository";
import { DecisionMakerServer } from "./server";

let connectionName: string;
if (process.env.DOCKER && process.env.DOCKER === "true") {
    connectionName = "docker";
} else {
    connectionName = "local";
}

createConnection(connectionName).then(async (connection) => {
    const voteRepo = connection.getCustomRepository(VoteRepository);
    const choiceRepo = connection.getCustomRepository(ChoiceRepository);
    const app = new DecisionMakerServer(voteRepo, choiceRepo, "salt").app;

    // start express server
    const port = process.env.PORT || 3001;
    app.listen(port);
    console.log(`Express server has started on port ${port}.`);

}).catch((error) => console.log(error));
