"use strict";

import { generateHash, compareHash, generateJWT } from "./security";
import {USER_COLLECTION_REFERENCE, User, userModel} from "../models/User"
import Database from "./Database";
import sequelizeTableConfig from "../configs/sequelizeTableConfig";

const DB_PREFIX = (process.env.NODE_ENV || "").toLowerCase() === "test" ? "TEST_" : "";
const dbObject: any = new Database("postgres", {
    "database": process.env[`${DB_PREFIX}POSTGRES_DB`],
    "username": process.env[`${DB_PREFIX}POSTGRES_USER`],
    "password": process.env[`${DB_PREFIX}POSTGRES_PASSWORD`],
    "host": process.env[`${DB_PREFIX}POSTGRES_HOST_URL`],
    "port": process.env[`${DB_PREFIX}POSTGRES_PORT`]
});


export default {

    "User": dbObject.Client.define(
        USER_COLLECTION_REFERENCE,
        userModel(),
        sequelizeTableConfig
    ),

    /**
     * Creates a new User.
     * @method createUser
     * @async
     * @param {string} username - User's unique name - a sort of nickname.
     * @param {string} firstName - User's first name.
     * @param {string} lastName - User's last name.
     * @param {string} rawPassword - User's raw password - this will be converted to a hash.
     * @return {Promise<User|Error>} Containing the created User object.
     */
    "createUser": async function (
        username: string,
        firstName: string,
        lastName: string,
        rawPassword: string
    ): Promise<User|Error> {
        if (!username || !firstName || !lastName || !rawPassword) {
           throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User properties."
           }));
        }

        const isUserExistent = await this.retrieveUserInfo(
            {
                username
            },
            false,
            true
        );

        if (isUserExistent) {
            throw new Error(JSON.stringify({
                "status": 409,
                "message": `User ${username} already exists.`
            }));
        } else {
            return (await this.User.create({
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "password": await generateHash(rawPassword)
            })).toJSON();
        }
    },


    /**
     * Retrieves all User objects.
     * @method retrieveAllUsersInfo
     * @async
     * @param {number} [limit=10] - Limit the number of items in the result set.
     * @param {number} [offset=0] - Skip entries to support pagination.
     * @param {string|Array<string>} [orderBy=["username", "ASC"]] - Sort the results as demonstrated in Sequelize doc {@see https://sequelize.org/master/manual/model-querying-basics.html#ordering}.
     * @return {Promise<Array<User>|Error>} Array containing a list of User objects.
     */
    "retrieveAllUsersInfo": async function(limit: number = 10, offset: number = 0, orderBy: string|Array<string> = ["username", "ASC"]) {
        return await this.User.findAll({
            "limit": limit,
            "offset": offset,
            "order": [orderBy],
            "attributes": {"exclude": ["password"]}
        });
    },


    /**
     * Retrieves a single User object based on a query.
     * @method retrieveUserInfo
     * @async
     * @param {object} query - Query object to fetch User through ID or username.
     * @param {boolean} [includePassword=false] - Include User's hashed password into the result object.
     * @param {boolean} [acceptNotFound=false] - Define if the code should emit an error if no entries are found.
     * @return {Promise<User|null|Error>} Object containing the User object.
     */
    "retrieveUserInfo": async function (
        query: {
            "id"?: number|undefined,
            "username"?: string|undefined
        },
        includePassword: boolean = false,
        acceptNotFound: boolean = false
    ): Promise<User|null|Error> {

        if (!query || (!query.id && !query.username)) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            }));
        }

        const userObject = await this.User.findOne({
            "attributes": includePassword ? {} : {"exclude": ["password"]},
            "where": query
        });

        if (userObject) {
            return userObject.toJSON();
        } else {
            if (!acceptNotFound) {
                throw new Error(JSON.stringify({
                    "status": 404,
                    "message": `User ${query.id || query.username} not found.`
                }));
            } else {
                return null;
            }
        }
    },


    /**
     * Deletes an existent User.
     * @method deleteUser
     * @async
     * @param {number} userId - User's unique row ID.
     * @return {Promise<string|Error>} Containing the created User object.
     */
    "deleteUser": async function (
        userId: number
    ): Promise<string|Error> {
        if (!userId) {
               throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing User ID."
            }));
        }

         let operationStatus = await (this.User.destroy({
             "where": {
                 "id": userId
             }
        }));

        if (operationStatus) {
            return `User ${userId} deleted.`;
        } else {
            throw new Error(JSON.stringify({
                "status": 404,
                "message": `User ${userId} not found.`
            }));
        }
    },


    /**
     * Create a JWT string upon user authentication.
     * @method authorizeUser
     * @async
     * @param {string} username - User's unique name - a sort of nickname.
     * @param {string} rawPassword - User's raw password - this will be compared against the stored hash.
     * @return {Promise<String|Error>} JWT string representing the User object and permissions.
     */
    "authorizeUser": async function(
        username: string,
        rawPassword: string
    ): Promise<string|Error> {
        if (!username || !rawPassword) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing parameters to authorize user."
            }));
        }
        const userObject: any = await this.retrieveUserInfo(
            {
                username
            },
            true,
            false
        ) as User;

        const isPasswordValid = await compareHash(
            rawPassword as string, userObject?.password
        ) as boolean;

        if (isPasswordValid) {
            return await generateJWT(
                {
                    ...userObject,
                    "password": undefined
                },
                process.env.APP_SECRET,
                {
                    "expiresIn": "5 minutes"
                }
            );
        } else {
            throw new Error(JSON.stringify({
                "status": 401,
                "message": `Incorrect credentials. Modify it, and try again.`
            }));
        }
    }
};