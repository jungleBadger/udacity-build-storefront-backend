"use strict";

import {ORDER_PRODUCTS_TABLE_REFERENCE, OrderProduct, orderProductModel} from "../models/OrderProducts";
import Database from "./Database";
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

    "OrderProduct": (() => {
        let model = dbObject.Client.define(
            ORDER_PRODUCTS_TABLE_REFERENCE,
            orderProductModel(),
            sequelizeTableConfig
        );
        return model;
    })(),

    async createOrderProduct(productId: number, productQuantity: number, orderId: number) {

        try {
            return await this.OrderProduct.create({
                productId,
                productQuantity,
                orderId
            });
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                throw new Error(JSON.stringify({
                    "status": 409,
                    "message": "Can't add the same product to the same order twice."
                }));
            } else {
                throw e;
            }
        }
    },

    async updateOrderProduct(orderId: number, productId: number, newQuantity: number) {
        await this.OrderProduct.update({
            "where": {
                "orderId": orderId,
                "productId": productId
            },
            "fields": {
                "productQuantity": newQuantity
            }
        });
    },

    async deleteOrderProduct(orderId: number, productId: number) {
        await this.OrderProduct.delete({
            "where": {
                "orderId": orderId,
                "productId": productId
            }
        });
    },


};