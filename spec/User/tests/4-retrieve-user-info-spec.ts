
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";
import {Op} from "sequelize";

import faker from "faker";

const VALID_MODEL: any = {
    "username": faker.internet.userName(),
    "firstName": faker.name.findName(),
    "lastName": faker.name.findName(),
    "rawPassword": faker.internet.password()
};

let createdUserModel: any;


describe("[User] - retrieveUserInfo method testing", function() {
    
    beforeAll(async () => {
        // create base admin user
        createdUserModel = await  users.createUser(
            VALID_MODEL.username,
            VALID_MODEL.firstName,
            VALID_MODEL.lastName,
            VALID_MODEL.rawPassword
        );
    });

    afterAll(async () => {
        await users.User.destroy({
            "where": {
                "username": {
                    [Op.ne]: "admin"
                }
            }
        });
    });


    it("should throw an error if `query.id` AND `query.username` aren't present", async (done) => {

        try {
            await users.retrieveUserInfo({
                "id": 0
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            })));
        }

        try {
            await users.retrieveUserInfo({
                "username": ""
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            })));
        }

        await Promise.all([
            users.retrieveUserInfo({
                "id": createdUserModel.id
            }),
            users.retrieveUserInfo({
                "username": createdUserModel.username
            }),
            users.retrieveUserInfo({
                "id": createdUserModel.id,
                "username": createdUserModel.username
            })
        ]);


        return done();

    });

    it("should retrieve the previously created user by ID", async (done) => {
        let userInfo = await users.retrieveUserInfo({
            "id": createdUserModel.id
        }) as any;
        expect(userInfo).toBeTruthy();
        expect(userInfo.id === createdUserModel.id).toBeTruthy();
        expect(userInfo.username === createdUserModel.username).toBeTruthy();
        done();
    });

    it("should retrieve the previously created user by username", async (done) => {
        let userInfo = await users.retrieveUserInfo({
            "username": createdUserModel.username
        }) as any;
        expect(userInfo).toBeTruthy();
        expect(userInfo.id === createdUserModel.id).toBeTruthy();
        expect(userInfo.username === createdUserModel.username).toBeTruthy();
        done();
    });

    it("should include user's hashed password if the option is enabled", async (done) => {
        let userInfo = await users.retrieveUserInfo({
            "username": createdUserModel.username
        }, true) as any;
        expect(userInfo).toBeTruthy();
        expect(userInfo.id === createdUserModel.id).toBeTruthy();
        expect(userInfo.username === createdUserModel.username).toBeTruthy();
        expect(userInfo.password).toBeTruthy();
        done();

    });

    it("should throw a 404 error if ID is not found", async (done) => {
        const INVALID_ID = 1111111111;
        try {
            await users.retrieveUserInfo({
                "id": INVALID_ID
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 404,
                "message": `User ${INVALID_ID} not found.`
            })));
            done();
        }

    });

    it("should throw a 404 error if username is not found", async (done) => {
        const INVALID_USERNAME = "BLABLABLBAL";
        try {
            await users.retrieveUserInfo({
                "username": INVALID_USERNAME
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 404,
                "message": `User ${INVALID_USERNAME} not found.`
            })));
            done();
        }
    });


    it("should return null if acceptNotFound flag is enabled", async (done) => {
        const INVALID_USERNAME = "BLABLABLBAL";
        let userInfo =  await users.retrieveUserInfo({
            "username": INVALID_USERNAME
        }, false, true);

        expect(userInfo).toBeNull();
        done();
    });



});