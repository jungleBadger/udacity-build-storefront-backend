"use strict";

import * as dotenv from "dotenv";
let dotEnvProps: Object = {"silent": true};
dotenv.config(dotEnvProps);

import { json } from "body-parser"
import debug from "debug";
import express = require("express");
import helmet = require("helmet");
import morgan = require("morgan");
import routes from "./routes/routes";

const app: express.Application = express();
const APP_PORT: Number|String = process.env.APP_PORT || 3030;
const log: any = debug("app:main");
const httpLog: any = debug("app:endpoint");

app.use(helmet({
    "contentSecurityPolicy": false
}));
app.use(json());

if (httpLog.enabled) {
    app.use(
        morgan(
            "combined",
            {
                "stream": {
                    "write": (msg: String) => httpLog(msg.trimEnd())
                }
            }
        )
    );
}

app.listen(APP_PORT, function () {
    routes(app);
    log(`Server started at port: ${APP_PORT}`);
});
