"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);

import bent from "bent";
import {run} from "../../../src/server";
import users from "../../../src/helpers/users";

const APP_PORT = 6090;
const API_URL = `${process.env.LOCAL_HTTPS ? "https" : "http"}://localhost:${APP_PORT}/api`;
const server = run(
    APP_PORT,
    false
);


describe("Endpoints testing", function() {

    describe("Unauthenticated requests", function () {
        it("should respond with an error if JWT is unavailable", async (done) => {
            const post = bent(`${API_URL}`, "POST", "string", 400);


            const response = await post('/users/create', {
                "username": `${Date.now()}_API_USER`,
                "firstName": "TEST_USER_API",
                "lastName": "TEST",
                "rawPassword": "TEST_PASSWORD"
            });

            expect(response).toEqual("Token not found - send it through Auth header or signed cookie.");

            done();
        });

        it("should respond with an error if Auth header has an invalid model", async (done) => {
            const post = bent(`${API_URL}`, "POST", "string", 400, {
                "Authorization": "xxxx"
            });

            const response = await post('/users/create', {
                "username": `${Date.now()}_API_USER`,
                "firstName": "TEST_USER_API",
                "lastName": "TEST",
                "rawPassword": "TEST_PASSWORD"
            });

            expect(response).toEqual("Empty token.");

            done();
        });

    });

    describe("Authenticated requests", async function () {

        let validToken = await users.authorizeUser(
            process.env.ADMIN_USER || "admin",
            process.env.ADMIN_PASSWORD || "admin123",
        );

    });

});