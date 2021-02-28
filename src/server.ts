"use strict";

import compression = require('compression');
import cookieParser = require('cookie-parser');

import debug from "debug";
import express = require("express");
import helmet = require("helmet");
import morgan = require("morgan");
import routes from "./routes/routes";
import users from "./helpers/users";
import * as fs from "fs";

const app: express.Application = express();
const APP_PORT: number|string = process.env.APP_PORT || 3030;
const log: any = debug("app:main");
const httpLog: any = debug("app:endpoint");
let server: any;

app.use(compression());
app.use(cookieParser(process.env.APP_SECRET));

app.use(helmet({
    "contentSecurityPolicy": false
}));
app.use(express.urlencoded({
    "extended": true,
    "limit": "3mb"
}));
app.use(express.json());

if (httpLog.enabled) {
    app.use(
        morgan(
            "combined",
            {
                "stream": {
                    "write": (msg: string) => httpLog(msg.trimEnd())
                }
            }
        )
    );
}


export async function run (CUSTOM_APP_PORT: number = 0, skipAdminAdd: boolean = false) {

    if (process.env.LOCAL_HTTPS) {
        server = require("https").createServer({
            "hostname": "localhost",
            "agent": false,
            "key": fs.readFileSync("./root/certificates/local/localhost-privkey.pem"),
            "cert": fs.readFileSync("./root/certificates/local/localhost-cert.pem"),
            "rejectUnauthorized": false
        } as object, app);
    } else {
        server = require("http").createServer(app);
    }

    log(`${process.env.LOCAL_HTTPS ? "HTTPS" : "HTTP"} server created`);

     if (!skipAdminAdd) {
        try {
            await users.createUser(
                process.env.ADMIN_USER || "admin",
                "Daniel",
                "Abrao",
                process.env.ADMIN_PASSWORD || "admin123"
            );
            log("Default admin user created.");

        } catch (e) {
            log("Default admin already exists.");
        }
    }

    server.listen(CUSTOM_APP_PORT || APP_PORT, function () {
        routes(app);
        log(`Server started at port: ${CUSTOM_APP_PORT || APP_PORT}`);
    });

    return server;
}
