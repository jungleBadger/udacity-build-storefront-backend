"use strict";

import { sign, verify, Secret, SignCallback, SignOptions, VerifyOptions, VerifyCallback } from "jsonwebtoken";
import { hash, compare } from "bcrypt";


/**
 * Generates a JWT applying app configs
 * @method generateJWT
 * @param {string|Buffer|object} rawData - Raw data to build the JWT.
 * @param {string} [secret] - Token to sign the secret, defaults to APP_SECRET env.
 * @param {object} [options] - Token options. {@see https://tools.ietf.org/html/rfc7519#section-4.1}
 * @return {Promise<String|Error>} Containing the hashed token.
 */
export function generateJWT(rawData: object|string = {}, secret: string = "", options: any = {}): Promise<String|Error> {
	return new Promise((resolve, reject) => {

		let callbackFn = (err: any, token: String): void => {
			return err ? reject(err) : resolve(token);
		};

		sign(
			rawData,
			(secret || process.env.APP_SECRET) as Secret,
			options as SignOptions,
			callbackFn as SignCallback
		);
	});
}


/**
 * Validates an app generated JWT
 * @method validateJWT
 * @param {string} token - Hashed string to be checked.
 * @param {string} [secret] - Token to sign the secret, defaults to APP_SECRET env.
 * @param {object} [options={}] - Token options. {@see https://tools.ietf.org/html/rfc7519#section-4.1}
 * @throws Will throw a `400 - bad request` if required params are missing.
 * @throws Will throw a `401 - unauthorized` if the token validation fails.
 * @throws Will throw a `422 - unprocessable entity` if the token string is malformed.
 * @return {Promise<object|Error>} Containing the result of comparison
 */
export function validateJWT(token: string, secret = "", options = {}) {
	return new Promise((resolve, reject) => {

		if (!token || (!secret && !process.env.APP_SECRET)) {
			return reject(
				JSON.stringify({
					"status": 400,
					"message": "Invalid params."
				})
			);
		}

		let verifyCBFunction = (err: any, decoded: string): void => {
			if (!err) {
				return resolve(decoded);
			} else if (err === "invalid algorithm" || err === "jwt malformed") {
				return reject(
					JSON.stringify({
						"status": 422,
						"message": "Error parsing token."
					})
				);
			} else {
				return reject(
					JSON.stringify({
						"status": 401,
						"message": "Unauthorized call."
					})
				);
			}
		}

		verify(
			token,
			(secret || process.env.APP_SECRET) as Secret,
			options as VerifyOptions,
			verifyCBFunction as unknown as VerifyCallback

		);
	});
}


/**
 * Generates a Hash from a given data.
 * @method generateHash
 * @param {string|Buffer} rawData - Raw data to be hashed.
 * @param {number} [customRounds=10] - Token to sign the secret, defaults to APP_SECRET env.
 * @return {Promise<String|Error>} Containing the hashed token.
 */
export async function generateHash(rawData: string, customRounds: number = 10): Promise<String|Error> {
	return await hash(
		rawData,
		customRounds
	);
}


/**
 * Compares raw data with a previously generated hash.
 * @method compareHash
 * @param {string|Buffer} rawData - Raw data to be compared.
 * @param {string} hash - Previously hashed password to be compared.
 * @return {Promise<Boolean|Error>} Containing the hashed token.
 */
export async function compareHash(rawData: string, hash: string): Promise<Boolean|Error> {
	return await compare(
		rawData,
		hash
	);
}