"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();
import orders from "../../helpers/orders";

/**
 * @swagger
 * /api/orders/:userId/current:
 *   get:
 *     tags: [Orders]
 *     summary: Get the Current order of a given user.
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
 *         description: An object representing the user's current order.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: User not found or order unavailable.
 *       500:
 *         description: Error handler.
 */
router.get("/:userId/current",
    async (req: Request, res: Response) => {
      return res.status(200).send(await orders.test());
    }
);

/**
 * @swagger
 * /api/orders/:userId/completed:
 *   get:
 *     tags: [Orders]
 *     summary: Get the Current order of a given user.
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
 *         description: An array containing all the user's completed orders.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: User not found or order unavailable.
 *       500:
 *         description: Error handler
 */
router.get("/:userId/completed",
    async (req: Request, res: Response) => {
      return res.status(200).send(await orders.test());
    }
);

export default router;