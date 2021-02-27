"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);

import bent from "bent";
import {run} from "../../../src/server";
import users from "../../../src/helpers/users";
import {Op} from "sequelize";


const APP_PORT = 6096;
const API_URL = `${process.env.LOCAL_HTTPS ? "https" : "http"}://localhost:${APP_PORT}/api`;
const server = run(
    APP_PORT,
    true
);

let user1: any;
const user1Password: string = "123456";
let validToken: string;





describe("[User] - endpoints testing", function() {

    beforeAll(async () => {
        // create base admin user
        user1 = await users.createUser(
            `${Date.now()}_TEST_SAMPLE_01`,
            "test",
            "one",
            user1Password
        );

        validToken = await users.authorizeUser(
            user1.username,
            user1Password
        ) as string;
    });

    afterAll(async () => {
        // delete all users other than admin
        await users.User.destroy({
            "where": {
                "username": {
                    [Op.ne]: "admin"
                }
            }
        });
    });

    describe("[POST /api/users/createUser] Create user endpoint test", function () {
        const USER_ID = `${Date.now()}_NEW_API_USER`;

        it("Should create an user", async () => {

            const post = bent(`${API_URL}`, "POST", "json", 201, {
                "Authorization": `Bearer ${validToken}`
            });

            const newUser: any = await post('/users/create', {
                "username": USER_ID,
                "firstName": "TEST_USER_API",
                "lastName": "TEST",
                "rawPassword": "TEST_PASSWORD"
            });

            expect(newUser.username).toEqual(USER_ID);
            expect(newUser.firstName).toEqual("TEST_USER_API");
        });

        it("Should not create a duplicated user", async () => {

            const post = bent(`${API_URL}`, "POST", "string", 409, {
                "Authorization": `Bearer ${validToken}`
            });

            const result = await post('/users/create', {
                "username": USER_ID,
                "firstName": "TEST_USER_API",
                "lastName": "TEST",
                "rawPassword": "TEST_PASSWORD"
            });

            expect(result).toEqual(`User ${USER_ID} already exists.`);
        });
    });

    describe("[GET /api/users/:userId] Retrieve single user endpoint test", function () {
        it("should fetch an existent user by ID", async () => {

            const get = bent(`${API_URL}`, "GET", "json", 200, {
                "Authorization": `Bearer ${validToken}`
            });

            const user: any = await get(`/users/${user1.id}`);

            expect(user.id).toEqual(user1.id);
        });

        it("should not fetch an invalid user", async () => {
            const INVALID_USER_ID = "999999999999";
            const get = bent(`${API_URL}`, "GET", "string", 404, {
                "Authorization": `Bearer ${validToken}`
            });

            const result = await get(`/users/${INVALID_USER_ID}`);

            expect(result).toEqual(`User ${INVALID_USER_ID} not found.`);
        });
    });

    describe("[GET /api/users/] Retrieve all available users endpoint test", function () {
        it("should fetch an existent user by ID", async () => {

            const get = bent(`${API_URL}`, "GET", "json", 200, {
                "Authorization": `Bearer ${validToken}`
            });

            const users = await get("/users/");

            expect(Array.isArray(users)).toBeTruthy();
        });


    });

});