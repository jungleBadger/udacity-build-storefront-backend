
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";
import {Op} from "sequelize";

const VALID_MODEL: any = {
    "username": `${Date.now()}_USER_DELETE`,
    "firstName": "TEST_USER",
    "lastName": "TEST",
    "rawPassword": "TEST_PASSWORD"
};

let createdUserModel: any;


describe("[User] - deleteUser method testing", function() {

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


    it("should throw an error if user ID is not valid", async (done) => {
        const INVALID_ID = 0;
        try {
            await users.deleteUser(
                INVALID_ID
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User ID."
            })));
            return done();
        }
    });

    it("should throw an error if user ID is not found", async (done) => {
        const NOT_EXISTENT_ID = 111111;
        try {
            await users.deleteUser(
                NOT_EXISTENT_ID
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 404,
                "message": `User ${NOT_EXISTENT_ID} not found.`
            })));
            return done();
        }
    });

    it("should delete the previously created user", async (done) => {
        let operationStatus = await users.deleteUser(
            createdUserModel.id
        );
        expect(operationStatus).toEqual(`User ${createdUserModel.id} deleted.`)
        done();
    });


});