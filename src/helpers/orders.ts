"use strict";

import Database from "./Database";

const DB_PREFIX = process.env.NODE_ENV === "TEST" ? "TEST_" : "";
const dbObject: any = new Database("postgres", {
    "database": process.env[`${DB_PREFIX}POSTGRES_DB`],
    "username": process.env[`${DB_PREFIX}POSTGRES_USER`],
    "password": process.env[`${DB_PREFIX}POSTGRES_PASSWORD`],
    "host": process.env[`${DB_PREFIX}POSTGRES_HOST_URL`],
    "port": process.env[`${DB_PREFIX}POSTGRES_PORT`]
});
const ORDERS_COLLECTION = "orders";


export default {
  "test": async function () {
      return await dbObject.Client.query(
          `SELECT * FROM ${ORDERS_COLLECTION}`,
          {
              "type": dbObject.Client.QueryTypes.SELECT
          }
      );
  }

};