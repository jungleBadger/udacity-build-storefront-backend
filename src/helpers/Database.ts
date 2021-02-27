"use strict";

import debug from "debug";
import {Sequelize, DataTypes, Op} from "sequelize";

const log: any = debug("app:helpers:database");
import * as Joi from "joi";

const dbSchema = Joi.object(
    {
        "dialect": Joi.alternatives().try("mysql", "mariadb", "postgres", "mssql"),
        "database": Joi.string().required(),
        "host": Joi.string().required(),
        "username": Joi.string().required(),
        "password": Joi.string().required(),
        "port": Joi.number().integer().allow(null),
        "dialectOptions": Joi.object().allow(null),
        "pool": Joi.object().allow(null),
        "logging": Joi.function().allow(false).allow(null)
    }
);

class Database {
    /**
     * Hold the instantiated Sequelize instance.
     *
     * @memberOf Database
     * @public
     */
    public Client: Sequelize;

    /**
     * Hold the valid Data types
     *
     * @memberOf Database
     * @public
     */
    public DataTypes: any = DataTypes;

    /**
     * Hold the valid Operators
     *
     * @memberOf Database
     * @public
     */
    public Op: any = Op;

    /**
     * Create a new Database instance using the provided connection info returning a Sequelize instance.
     *
     * @memberOf Database
     * @private
     * @param {string} dbType - Type of the database to be created.
     * @param {Object} dbConnectionInfo - The instance's URL.
     * @param {string} dbConnectionInfo.database - The instance's database.
     * @param {string} dbConnectionInfo.password - The instance's password.
     * @param {string} dbConnectionInfo.host - The instance's host URL.
     * @param {number} dbConnectionInfo.port - The instance's port.
     * @param {string} [dbConnectionInfo.b64Certificate] - The instance's base 64 certificate.
     * @return {Sequelize} A Sequelize instance {@see https://sequelize.org/master/}
     */
    private buildConnection(dbType: string, dbConnectionInfo: any) {
        let schema = dbSchema.validate({
            "database": dbConnectionInfo.database,
            "username": dbConnectionInfo.username,
            "password": dbConnectionInfo.password,
            "host": dbConnectionInfo.host,
            "port": dbConnectionInfo.port || null,
            "dialect": dbType,
            "dialectOptions": {
                "ssl": dbConnectionInfo.b64Certificate ? {
                    "ca": Buffer.from(
                        dbConnectionInfo.b64Certificate,
                        "base64"
                    ).toString("ascii")
                } : null
            },
            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            },
            "logging": (
                Object.prototype.hasOwnProperty.call(dbConnectionInfo, "logging") ?
                    dbConnectionInfo.logging :
                    ((msg: string) => log(msg))
            )
        });

        if (schema.error) {
            throw new Error(
                JSON.stringify({
                    "status": 400,
                    "message": schema.error.message
                })
            );
        }

        return new Sequelize(
            schema.value
        );
    }

    /**
     * Constructs new Database instance using the provided connection info.
     *
     * @constructor
     * @param {string} dbType - Type of the database to be created.
     * @param {Object} dbConnectionInfo - The instance's URL.
     * @param {string} dbConnectionInfo.username - The instance's username.
     * @param {string} dbConnectionInfo.password - The instance's password.
     */
    constructor(dbType: string, dbConnectionInfo: Object) {
        if (!dbType ||  !dbConnectionInfo) {
            throw new Error(
                JSON.stringify({
                    "status": 400,
                    "message": "Invalid DB configuration."
                })
            );
        }

        this.Client = this.buildConnection(dbType, dbConnectionInfo);

    }
}

export default Database;