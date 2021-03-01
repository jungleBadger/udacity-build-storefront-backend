
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";
import { validateJWT } from "../../../src/helpers/security";
import {Op} from "sequelize";

import faker from "faker";

const VALID_MODEL: any = {
    "username": faker.internet.userName(),
    "firstName": faker.name.findName(),
    "lastName": faker.name.findName(),
    "rawPassword": faker.internet.password()
};

let createdUserModel: any;


describe("[User] - authorizeUser method testing", function() {

    beforeAll(async () => {
        // create base admin user
        createdUserModel = await users.createUser(
            VALID_MODEL.username,
            VALID_MODEL.firstName,
            VALID_MODEL.lastName,
            VALID_MODEL.rawPassword
        );
    });

    afterAll(async () => {
        // delete base admin user
        await users.User.destroy({
            "where": {
                "username": {
                    [Op.ne]: "admin"
                }
            }
        });
    });



    it("should throw an error if username is not valid", async (done) => {

        try {
            await users.authorizeUser("", VALID_MODEL.password);
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing parameters to authorize user."
            })));
        }

        return done();
    });

    it("should throw an error if password is not valid", async (done) => {

        try {
            await users.authorizeUser(createdUserModel.username, "");
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing parameters to authorize user."
            })));
        }

        return done();
    });

    it("should throw an error if username and password don't match", async (done) => {

        try {
            await users.authorizeUser(createdUserModel.username, "BLABLABLA");
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 401,
                "message": "Incorrect credentials. Modify it, and try again."
            })));
        }

        return done();
    });

    it("should generate the JWT string if username and password are valid", async (done) => {

        let token = await users.authorizeUser(createdUserModel.username, VALID_MODEL.rawPassword) as string;
        expect(token).toBeTruthy();
        let tokenValidation = await validateJWT(token);
        expect(tokenValidation).toBeTruthy();
        return done();
    });


});