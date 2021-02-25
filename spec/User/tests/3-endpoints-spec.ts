"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);

import bent from "bent";
import {run} from "../../../src/server";
import users from "../../../src/helpers/users";

const APP_PORT = 6096;
const API_URL = `${process.env.LOCAL_HTTPS ? "https" : "http"}://localhost:${APP_PORT}/api`;
const server = run(
    APP_PORT,
    true
);

let user1: any;





describe("[User] - endpoints testing", function() {

    beforeAll(async () => {
        // create base admin user
        user1 = users.createUser(
            `${Date.now()}_TEST_SAMPLE_01`,
            "test",
            "one",
            "123456"
        );
    });

    afterAll(async () => {
        // delete base admin user

        await users.deleteUser(
            user1.id
        );
    });

});