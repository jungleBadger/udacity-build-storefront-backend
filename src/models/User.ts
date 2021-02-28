"use strict";

import {DataTypes} from "sequelize";

export const USER_COLLECTION_REFERENCE = "user";

export interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    password?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export function userModel(): object {
    return {
        "id": {
            "type": DataTypes.NUMBER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "username": {
            "type": DataTypes.TEXT,
            "unique": true
        },
        "firstName": {
            "type": DataTypes.TEXT,
            "notNull": true,
            "as": "firstName"
        },
        "lastName": {
            "type": DataTypes.TEXT,
            "notNull": true
        },
        "password": {
            "type": DataTypes.TEXT,
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