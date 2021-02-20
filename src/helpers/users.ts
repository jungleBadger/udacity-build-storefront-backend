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
const USERS_COLLECTION = "users";


export default {
  "test": async function () {
      return await dbObject.Client.query(`SELECT * FROM ${USERS_COLLECTION}`);
  }

};