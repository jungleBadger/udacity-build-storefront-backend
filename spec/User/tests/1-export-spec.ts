
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";

describe("[User] - Valid helper import",() => {

    it("should offer a JSON-like interface",() => {
        expect(
            users
        ).toBeInstanceOf(Object);
    });

    it("should export the `User` schema",() => {
        expect(
           users.hasOwnProperty("User")
        ).toBeTruthy();

        expect(
            users.User
        ).toBeInstanceOf(Function);
    });

    it("should export the `createUser` method",() => {
        expect(
            users.hasOwnProperty("createUser")
        ).toBeTruthy();

        expect(
            users.createUser
        ).toBeInstanceOf(Function);
    });

    it("should export the `retrieveAllUsersInfo` method",() => {
        expect(
            users.hasOwnProperty("retrieveAllUsersInfo")
        ).toBeTruthy();

        expect(
            users.retrieveAllUsersInfo
        ).toBeInstanceOf(Function);
    });

    it("should export the `retrieveUserInfo` method",() => {
        expect(
            users.hasOwnProperty("retrieveUserInfo")
        ).toBeTruthy();

        expect(
            users.retrieveUserInfo
        ).toBeInstanceOf(Function);
    });

    it("should export the `authorizeUser` method",() => {
        expect(
            users.hasOwnProperty("authorizeUser")
        ).toBeTruthy();

        expect(
            users.authorizeUser
        ).toBeInstanceOf(Function);
    });

});