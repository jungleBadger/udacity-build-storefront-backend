"use strict";

import { generateHash, compareHash, generateJWT } from "./security";
import Database from "./Database";

const dbObject: any = new Database("postgres", {
    "database": process.env.POSTGRES_DB,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "host": process.env.POSTGRES_HOST_URL,
    "port": process.env.POSTGRES_PORT
});

interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    updatedAt: Date
    password?: string,
    createdAt?: Date,
}

export default {

    "User": dbObject.Client.define("user", {
        "id": {
            "type": dbObject.DataTypes.NUMBER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "username": dbObject.DataTypes.TEXT,
        "firstName": dbObject.DataTypes.TEXT,
        "lastName": dbObject.DataTypes.TEXT,
        "password": dbObject.DataTypes.TEXT
    }),

    /**
     * Creates a new User.
     * @method compareHash
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
                "message": `User ${username} already exists`
            }));
        } else {
            return await (this.User.create({
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
     * @return {Promise<Array<User>|Error>} Array containing a list of User objects.
     */
    "retrieveAllUsersInfo": async function() {
        return await this.User.findAll({
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
                "message": "Invalid query options"
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
     * Create a JWT string upon user authentication.
     * @method authorizeUser
     * @async
     * @param {string} username - User's unique name - a sort of nickname.
     * @param {string} rawPassword - User's raw password - this will be compared against the stored hash.
     * @return {Promise<String|Error>} JWT string representing the User object and permissions.
     */
    async authorizeUser(
        username: string,
        rawPassword: string
    ): Promise<string|Error> {
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
                }
            );
        } else {
            throw new Error(JSON.stringify({
                "status": 401,
                "message": `Incorrect credentials. Change it, and try again.`
            }));
        }

    }
};