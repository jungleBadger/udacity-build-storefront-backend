"use strict";

import { validateJWT as validateJWTMethod } from "../../helpers/security";
import { NextFunction } from "express";

const ENV_COOKIE_KEY = `STOREFRONT-${process.env.APP_ENV}`;


export async function parseJWT(req: any, res: any, next: any) {
    let token;

    // try to grab token from Authorization header
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];

        // if token is not available, reject the request
        if (!token) {
            throw new Error(JSON.stringify({
                "status": 400,
                "message": "Empty token."
            }));
        }

        // If token is not available through the Authorization header, try grabbing it in the signed cookies header
    } else if (req.signedCookies[ENV_COOKIE_KEY]) {

        // Validate existent token
        token = req.signedCookies[ENV_COOKIE_KEY];
    } else {

        throw new Error(JSON.stringify({
            "status": 400,
            "message": "Token not found - send it through Auth header or signed cookie."
        }));
    }

    if (!token) {
        throw new Error(JSON.stringify({
            "status": 404,
            "message": "Token not found."

        }));
    } else {
        res.locals.token = token;
        return next();
    }
}

export async function validateJWT(req: any, res: any, next: any): Promise<NextFunction> {
    if (!res.locals.token) {
        throw new Error(JSON.stringify({
            "status": 404,
            "message": "Token not found."
        }));
    }

    await validateJWTMethod(res.locals.token);

    return next();

}