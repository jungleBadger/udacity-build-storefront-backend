"use strict";

import {DataTypes} from "sequelize";
import {orderModel} from "./Order";
import {productModel} from "./Product";

export const ORDER_PRODUCTS_TABLE_REFERENCE = "orderProduct";

export interface OrderProduct {
    id: number,
    productId: number,
    productQuantity: number,
    orderId: number,
    createdAt?: Date,
    updatedAt?: Date
}

export function orderProductModel(): object {
    return {

        "orderId": {
            "type": DataTypes.NUMBER,
            "notNull": true,
            "foreignKey": true,
            "primaryKey": true,
            "references": {
                "model": orderModel(),
                "key": "id"
            }
        },

        "productId": {
            "type": DataTypes.NUMBER,
            "notNull": true,
            "foreignKey": true,
            "primaryKey": true,
            "references": {
                "model": productModel(),
                "key": "id"
            }
        },

        "productQuantity": {
            "type": DataTypes.NUMBER,
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