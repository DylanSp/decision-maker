import "reflect-metadata";
import { createConnection } from "typeorm";
import { app } from "./server";

createConnection("prod").then(async (connection) => {
    // start express server
    const port = app.get("port");
    app.listen(port);
    console.log(`Express server has started on port ${port}.`);

}).catch((error) => console.log(error));
