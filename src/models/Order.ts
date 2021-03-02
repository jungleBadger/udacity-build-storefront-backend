"use strict";

import {DataTypes} from "sequelize";
import {userModel} from "./User"

export const ORDERS_TABLE_REFERENCE = "order";

export interface Order {
    id: number,
    userId: number,
    createdAt?: Date,
    updatedAt?: Date
}

export function orderModel(): object {
    return {
        "id": {
            "type": DataTypes.NUMBER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "userId": {
            "type": DataTypes.NUMBER,
            "notNull": true,
            "foreignKey": true,
            "references": {
                "model": userModel(),
                "key": "id"
            }
        },

        "status": {
            "type": DataTypes.TEXT,
            "notNull": true,
            "validate": {
                "isIn": [["active", "complete"]]
            }
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