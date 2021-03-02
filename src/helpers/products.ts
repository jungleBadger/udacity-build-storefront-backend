"use strict";

import {PRODUCTS_TABLE_REFERENCE, Product, productModel} from "../models/Product";

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

    "Product": (() => {
        let model = dbObject.Client.define(
            PRODUCTS_TABLE_REFERENCE,
            productModel(),
            sequelizeTableConfig
        );
        return model;
    })(),

    /**
     * Creates a new Product.
     * @method createProduct
     * @async
     * @param {string} name - Product's name.
     * @param {string} [description=""] - Product's optional description.
     * @param {number} price - Product's price.
     * @param {string} categoryId - Product's category ID.
     * @return {Promise<Product|Error>} Containing the created Product object.
     */
    "createProduct": async function (
        name: string,
        description: string = "",
        price: number,
        categoryId: number
    ): Promise<Product|Error> {
        if (!name || !categoryId) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product properties."
            }));
        }

        if (price < 0) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid price value."
            }));
        }

        try {
            return (await this.Product.create({
                "name": name,
                "description": description,
                "price": price,
                "categoryId": categoryId
            })).toJSON();
        } catch (e) {
            if (e.name === "SequelizeForeignKeyConstraintError") {
                throw new Error(JSON.stringify({
                    "status": 409,
                    "message": `Category ${categoryId} doesn't exist.`
                }));
            } else {
                throw e;
            }
        }

    },

    /**
     * Retrieves all Product objects.
     * @method retrieveAllProductsInfo
     * @async
     * @param {number} [limit=10] - Limit the number of items in the result set.
     * @param {number} [offset=0] - Skip entries to support pagination.
     * @param {string|Array<string>} [orderBy=["name", "ASC"]] - Sort the results as demonstrated in Sequelize doc {@see https://sequelize.org/master/manual/model-querying-basics.html#ordering}.
     * @return {Promise<Array<Product>|Error>} Array containing a list of Product objects.
     */
    "retrieveAllProductsInfo": async function(limit: number = 10, offset: number = 0, orderBy: string|Array<string> = ["name", "ASC"]) {
        return await this.Product.findAll({
            "limit": limit,
            "offset": offset,
            "order": [orderBy]
        });
    },


    /**
     * Retrieves a single Product object based on a query.
     * @method retrieveProductInfo
     * @async
     * @param {object} query - Query object to fetch Product through ID.
     * @param {boolean} [acceptNotFound=false] - Define if the code should emit an error if no entries are found.
     * @return {Promise<Product|null|Error>} Object containing the Product object.
     */
    "retrieveProductInfo": async function (
        query: {
            "id": number|undefined
        },
        acceptNotFound: boolean = false
    ): Promise<Product|null|Error> {

        if (!query || (!query.id)) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            }));
        }

        const productObject = await this.Product.findOne({
            "where": query
        });

        if (productObject) {
            return productObject.toJSON();
        } else {
            if (!acceptNotFound) {
                throw new Error(JSON.stringify({
                    "status": 404,
                    "message": `Product ${query.id} not found.`
                }));
            } else {
                return null;
            }
        }
    },


    /**
     * Retrieves all Product objects by a given category.
     * @method retrieveProductsByCategory
     * @async
     * @param {number} categoryId - The category ID to filter for.
     * @param {number} [limit=10] - Limit the number of items in the result set.
     * @param {number} [offset=0] - Skip entries to support pagination.
     * @param {Array<string>} [orderBy=["name", "ASC"]] - Sort the results as demonstrated in Sequelize doc {@see https://sequelize.org/master/manual/model-querying-basics.html#ordering}.
     * @return {Promise<Array<Product>|Error>} Array containing a list of Product objects.
     */
    "retrieveProductsByCategory": async function (categoryId: number, limit: number = 10, offset: number = 0, orderBy: Array<string> = ["name", "ASC"]) {

        if (!categoryId || categoryId < 0) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid Category ID."
            }));
        }

        return await this.Product.findAll({
            "where": {
                categoryId
            },
            "limit": limit,
            "offset": offset,
            "order": [orderBy]
        });
    },


    /**
     * Deletes an existent Product.
     * @method deleteProduct
     * @async
     * @param {number} productId - Products' unique row ID.
     * @return {Promise<string|Error>} Containing the operation status.
     */
    "deleteProduct": async function (
        productId: number
    ): Promise<string|Error> {
        if (!productId) {
               throw new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product ID."
            }));
        }

         let operationStatus = await this.Product.destroy({
             "where": {
                 "id": productId
             }
        });

        if (operationStatus) {
            return `Product ${productId} deleted.`;
        } else {
            throw new Error(JSON.stringify({
                "status": 404,
                "message": `Product ${productId} not found.`
            }));
        }
    },

};