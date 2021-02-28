"use strict";

import Database from "./Database";

import {PRODUCTS_COLLECTION_REFERENCE, Product, productModel} from "../models/Product"

const DB_PREFIX = process.env.NODE_ENV === "TEST" ? "TEST_" : "";
const dbObject: any = new Database("postgres", {
    "database": process.env[`${DB_PREFIX}POSTGRES_DB`],
    "username": process.env[`${DB_PREFIX}POSTGRES_USER`],
    "password": process.env[`${DB_PREFIX}POSTGRES_PASSWORD`],
    "host": process.env[`${DB_PREFIX}POSTGRES_HOST_URL`],
    "port": process.env[`${DB_PREFIX}POSTGRES_PORT`]
});



export default {

    "Product": dbObject.Client.define(PRODUCTS_COLLECTION_REFERENCE, productModel()),


    /**
     * Creates a new User.
     * @method createProduct
     * @async
     * @param {string} name - User's unique name - a sort of nickname.
     * @param {string} [description=""] - User's first name.
     * @param {string} price - User's last name.
     * @param {string} categoryId - User's raw password - this will be converted to a hash.
     * @return {Promise<User|Error>} Containing the created User object.
     */
    "createProduct": async function (
        name: string,
        description: string = "",
        price: number,
        categoryId: number
    ): Promise<Product|Error> {
        if (!name || !price || !categoryId) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product properties."
            }));
        }

        return new Error()
    },
    retrieveProductInfo() {

    },

    retrieveAllProductsInfo() {

    },

    retrieveProductsByCategory() {

    },

    retrieveTrendingProducts() {

    }

};