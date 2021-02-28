"use strict";

import {DataTypes} from "sequelize";

export const PRODUCTS_COLLECTION_REFERENCE = "product";

export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    category_id: number,
    createdAt?: Date,
    updatedAt?: Date
}

export function productModel(): object {
    return {
        "id": {
            "type": DataTypes.NUMBER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": {
            "type": DataTypes.TEXT,
            "notNull": true
        },
        "description": DataTypes.TEXT,
        "price": {
            "type": DataTypes.REAL,
            "notNull": true
        },
        "categoryId": {
            "type": DataTypes.NUMBER,
            "foreignKey": true,
            "notNull": true
        },
        "createdAt": {
            "type": DataTypes.DATE,
            "field": "createdAt"
        },
        "updatedAt": {
            "type": DataTypes.DATE,
            "field": "updatedAt"
        }
    }
}