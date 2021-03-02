"use strict";

import Database from "./Database";
import orderProducts from "./orderProducts";
import {ORDERS_TABLE_REFERENCE, Order, orderModel} from "../models/Order";
import sequelizeTableConfig from "../configs/sequelizeTableConfig";

const DB_PREFIX = process.env.NODE_ENV === "TEST" ? "TEST_" : "";
const dbObject: any = new Database("postgres", {
    "database": process.env[`${DB_PREFIX}POSTGRES_DB`],
    "username": process.env[`${DB_PREFIX}POSTGRES_USER`],
    "password": process.env[`${DB_PREFIX}POSTGRES_PASSWORD`],
    "host": process.env[`${DB_PREFIX}POSTGRES_HOST_URL`],
    "port": process.env[`${DB_PREFIX}POSTGRES_PORT`]
});



export default {
    "Order": (() => {
        let model = dbObject.Client.define(
            ORDERS_TABLE_REFERENCE,
            orderModel(),
            sequelizeTableConfig
        );
        model.hasMany(orderProducts.OrderProduct);
        return model;
    })(),


    "createOrder": async function(userId: number): Promise<Order|Error> {

        try {
            let operationResult = await this.Order.findOrCreate({
                "where": {
                    "userId": userId,
                    "status": "active"
                },
                "defaults": {
                    "userId": userId,
                    "status": "active",
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                }
            });

            return {
                ...operationResult[0].toJSON(),
                "isNew": operationResult[1]
            }
        } catch (e) {
            if (e.name === "SequelizeForeignKeyConstraintError") {
                throw new Error(JSON.stringify({
                    "status": 404,
                    "message": `User ${userId} doesn't exist. Order failed.`
                }));
            } else {
                throw e;
            }
        }

    },


    /**
     * Retrieves a single Order object based on a query.
     * @method retrieveOrderInfo
     * @async
     * @param {object} query - Query object to fetch Product through ID.
     * @param {boolean} [acceptNotFound=false] - Define if the code should emit an error if no entries are found.
     * @return {Promise<Order|null|Error>} Object containing the Order object.
     */
    "retrieveOrderInfo": async function (
        query: {
            "id": number|undefined
        },
        acceptNotFound: boolean = false
    ): Promise<Order|null|Error> {
        if (!query || (!query.id)) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            }));
        }

        const orderObject = await this.Order.findOne({
            "where": query,
            "include": [orderProducts.OrderProduct]
        });

        if (orderObject) {
            return orderObject.toJSON();
        } else {
            if (!acceptNotFound) {
                throw new Error(JSON.stringify({
                    "status": 404,
                    "message": `Order ${query.id} not found.`
                }));
            } else {
                return null;
            }
        }
    },

    "retrieveOrdersByUser": async function(userId: number, limit: number = 10, offset: number = 0, orderBy: string|Array<string> = ["id", "ASC"]): Promise<Array<Order|any>|Error> {
        if (!userId) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            }));
        }

        return await this.Order.findAll({
            "where": {
                "userId": userId
            },
            "include": [orderProducts.OrderProduct],
            "limit": limit,
            "offset": offset,
            "order": [orderBy]
        });
    },


    "retrieveActiveOrderFromUser": async function(userId: number, acceptNotFound: false): Promise<Order|null|Error> {
        if (!userId) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            }));
        }

        const orderObject = await this.Order.findOne({
            "where": {
                "userId": userId,
                "status": "active"
            },
            "include": [orderProducts.OrderProduct]
        });

        if (orderObject) {
            return orderObject.toJSON();
        } else {
            if (!acceptNotFound) {
                throw new Error(JSON.stringify({
                    "status": 404,
                    "message": `Active order from User ${userId} not found.`
                }));
            } else {
                return null;
            }
        }
    },

    closeOrder() {
        //@TODO implement later on - time is over.
        return false;
    },

    finishOrder() {
        //@TODO implement later on - time is over.
        return false;
    }

};