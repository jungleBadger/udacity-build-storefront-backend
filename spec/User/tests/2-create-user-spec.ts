
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";
import {Op} from "sequelize";

const VALID_MODEL: any = {
    "username": `${Date.now()}_USER`,
    "firstName": "TEST_USER",
    "lastName": "TEST",
    "rawPassword": "TEST_PASSWORD"
};

let createdUserModel: any;


describe("[User] - createUser method testing", function() {
    
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


    it("should fail if the `username` param is not available", async (done) => {
        try {
            await users.createUser(
                "",
                VALID_MODEL.firstName,
                VALID_MODEL.lastName,
                VALID_MODEL.rawPassword
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User properties."
            })));
            return done();
        }
    });
    
    it("should fail if the `firstName` param is not available",async (done) => {
        try {
            await users.createUser(
                VALID_MODEL.username,
                "",
                VALID_MODEL.lastName,
                VALID_MODEL.rawPassword
            )
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User properties."
            })));
            return done();
        }
    });
    
    it("should fail if the `lastName` param is not available",async (done) => {
        try {
            await users.createUser(
                VALID_MODEL.username,
                VALID_MODEL.firstName,
                "",
                VALID_MODEL.rawPassword
            )
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User properties."
            })));
            return done();
        }
    });
    
    it("should fail if the `rawPassword` param is not available",async (done) => {
        try {
            await users.createUser(
                VALID_MODEL.username,
                VALID_MODEL.firstName,
                VALID_MODEL.lastName,
                ""
            )
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User properties."
            })));
            return done();
        }
    });

    it("should fail if the User with the same `username` already exists",async (done) => {
        try {
            await users.createUser(
                VALID_MODEL.username,
                VALID_MODEL.firstName,
                VALID_MODEL.lastName,
                VALID_MODEL.rawPassword
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 409,
                "message": `User ${VALID_MODEL.username} already exists.`
            })));
            return done();
        }
    });

    it("should create the User",async (done) => {
        const newUsername = `${Date.now()}_TEST_SAMPLE_TWO`;
        const newUser: any = await users.createUser(
            newUsername,
            VALID_MODEL.firstName,
            VALID_MODEL.lastName,
            VALID_MODEL.rawPassword
        );

        expect(
            newUser
        ).toBeInstanceOf(
            Object
        );

        expect(
            newUser.username
        ).toEqual(newUsername);

        expect(
            newUser.firstName
        ).toEqual(VALID_MODEL.firstName);


        expect(
            newUser.lastName
        ).toEqual(VALID_MODEL.lastName);

        expect(
            newUser.rawPassword === VALID_MODEL.rawPassword
        ).toBeFalsy();


        await users.deleteUser(
            createdUserModel.id
        );

        return done();

    });

});