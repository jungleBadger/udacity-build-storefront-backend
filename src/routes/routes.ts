"use strict";

import {Application, Request, Response} from "express";

import authHandler from "./partials/authHandler";
import ordersHandler from "./partials/ordersHandler";
import productsHandler from "./partials/productsHandler";
import usersHandler from "./partials/usersHandler";

export default function (app: Application) {

	app.use("/auth", authHandler);
	app.use("/api/orders", ordersHandler);
	app.use("/api/products", productsHandler);
	app.use("/api/users", usersHandler);

	app.use((err: any, req: Request, res: Response, next: any) => {
		try {
			if (Object.prototype.hasOwnProperty.call(err, "status")) {
				return res.status(err.status || 500).send(err.message || err);
			} else {
				let parsedError = JSON.parse(err.message);
				return res.status(parsedError.status || 500).send(parsedError.message || err.message || "Unknown Error");
			}
		} catch (e) {
			return res.status(err.status || 500).send(err.message || err);
		}
	});

}