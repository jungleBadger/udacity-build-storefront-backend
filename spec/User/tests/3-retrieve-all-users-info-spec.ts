
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


describe("[User] - retrieveAllUserInfo method testing", function() {
    
    beforeAll(async () => {
        // create base admin user
        await Promise.all([
            users.createUser(
                `${VALID_MODEL.username}_SAMPLE_01`,
                VALID_MODEL.firstName,
                VALID_MODEL.lastName,
                VALID_MODEL.rawPassword
            ),
            users.createUser(
                `${VALID_MODEL.username}_SAMPLE_02`,
                VALID_MODEL.firstName,
                VALID_MODEL.lastName,
                VALID_MODEL.rawPassword
            )
        ]);
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


    it("should retrieve a list of users", async (done) => {
        let userList = await users.retrieveAllUsersInfo();
        expect(Array.isArray(userList)).toBeTruthy();
        done();
    });

    it("should correctly apply the limit of fetched items", async (done) => {
        let userList = await users.retrieveAllUsersInfo(1);
        expect(Array.isArray(userList)).toBeTruthy();
        expect(userList.length).toEqual(1);

        let secondUserList = await users.retrieveAllUsersInfo(2);
        expect(Array.isArray(secondUserList)).toBeTruthy();
        expect(secondUserList.length).toEqual(2);
        done();
    });

    it("should correctly apply the offset on fetched items", async (done) => {
        let userList = await users.retrieveAllUsersInfo(1);
        expect(Array.isArray(userList)).toBeTruthy();
        expect(userList.length).toEqual(1);

        let secondUserList = await users.retrieveAllUsersInfo(1, 1);
        expect(Array.isArray(secondUserList)).toBeTruthy();
        expect(secondUserList.length).toEqual(1);

        expect(JSON.stringify(userList) !== JSON.stringify(secondUserList)).toBeTruthy();
        done();
    });

    it("should correctly apply the sort on fetched items", async (done) => {
        let userList = await users.retrieveAllUsersInfo(1, 0, ["id", "ASC"]);
        expect(Array.isArray(userList)).toBeTruthy();
        expect(userList.length).toEqual(1);

        let secondUserList = await users.retrieveAllUsersInfo(1, 0, ["id", "DESC"]);
        expect(Array.isArray(secondUserList)).toBeTruthy();
        expect(secondUserList.length).toEqual(1);

        expect(JSON.stringify(userList) !== JSON.stringify(secondUserList)).toBeTruthy();
        done();
    });


});