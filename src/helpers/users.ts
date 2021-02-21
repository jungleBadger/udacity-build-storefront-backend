"use strict";

import {generateJWT, validateJWT} from "./security";
import Database from "./Database";


let dbObject: any = new Database("postgres", {
    "database": process.env.POSTGRES_DB,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "host": process.env.POSTGRES_HOST_URL,
    "port": process.env.POSTGRES_PORT
});

const userSchema = dbObject.Client.define("user", {
    "id": {
        "type": dbObject.DataTypes.NUMBER,
        "primaryKey": true
    },
    "username": dbObject.DataTypes.TEXT,
    "firstName": dbObject.DataTypes.TEXT,
    "lastName": dbObject.DataTypes.TEXT,
    "password": dbObject.DataTypes.TEXT
});


export default {
    "test": async function () {
        return 1;
    },
    "fetchUserInfo": async function (userId: number, acceptNotFound: boolean = false) {
        let userObject = await userSchema.findOne({
            "where": {
                "id": userId
            }
        });

        if (!userObject && !acceptNotFound) {
            throw new Error(JSON.stringify({
                "status": 404,
                "message": `User id ${userId} not found.`
            }))
        }

        return userObject;
    }
};