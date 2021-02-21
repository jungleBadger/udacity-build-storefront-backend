"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();
import users from "../../helpers/users";

/**
 * @swagger
 * /api/users/create:
 *   get:
 *     tags: [Users]
 *     summary: Creates a new user.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: firstName
 *        in: body
 *        required: true
 *        description: The User's first name.
 *        schema:
 *          type: string
 *      - name: lastName
 *        in: body
 *        required: true
 *        description: The User's last name.
 *        schema:
 *          type: string
 *      - name: password
 *        in: body
 *        required: true
 *        description: The User's raw password.
 *        schema:
 *          type: string
 *     responses:
 *       201:
 *         description: User created.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       409:
 *         description: User already exists.
 *       500:
 *         description: Error handler.
 */
router.post("/create",
    async (req: Request, res: Response) => {
        return res.status(200).send(await users.test());
    }
);

/**
 * @swagger
 * /api/users/:
 *   get:
 *     tags: [Users]
 *     summary: List all available users.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array containing users metadata.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       500:
 *         description: Error handler.
 */
router.get("/",
    async (req: Request, res: Response) => {
        return res.status(200).send(await users.test());
    }
);

/**
 * @swagger
 * /api/users/:userId
 *   get:
 *     tags: [Users]
 *     summary: Display information about a specific user.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The User's ID.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: An object representing the user's metadata.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error handler.
 */
router.get("/:userId",
    async (req: Request, res: Response) => {
        return res.status(200).send(
            await users.fetchUserInfo(Number(req.params.userId))
        );
    }
);


export default router;