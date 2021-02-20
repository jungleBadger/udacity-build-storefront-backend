"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();

/**
 * @swagger
 * /api/users/:
 *   get:
 *     tags: [Users]
 *     summary: Get JPG image as a stream
 *     produces:
 *       - image/jpeg
 *     parameters:
 *      - name: imageId
 *        in: query
 *        required: true
 *        description: The Image ID to search for.
 *        schema:
 *          type: string
 *      - name: width
 *        in: query
 *        required: false
 *        description: The image's custom width.
 *        schema:
 *          type: integer
 *      - name: height
 *        in: query
 *        required: false
 *        description: The image's custom height.
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: An array containing all events that match the criteria
 *       401:
 *         description: Invalid API token
 *       403:
 *         description: Expired or denied API token
 *       500:
 *         description: Error handler
 */
router.get("/",
    async (req: Request, res: Response) => {
      return res.status(200).send("xx");
    }
);

export default router;