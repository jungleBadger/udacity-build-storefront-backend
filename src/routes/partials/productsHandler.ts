"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();
import products from "../../helpers/products";


/**
 *
 * @swagger
 * /api/products/create:
 *   get:
 *     tags: [Products]
 *     summary: Creates a new Product.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: name
 *        in: body
 *        required: true
 *        description: The Product's name.
 *        schema:
 *          type: string
 *      - name: price
 *        in: body
 *        required: true
 *        description: The Product's price.
 *        schema:
 *          type: number
 *      - name: category
 *        in: body
 *        required: true
 *        description: The Product's category.
 *        schema:
 *          type: string
 *     responses:
 *       201:
 *         description: Product created.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       409:
 *         description: Product already exists.
 *       500:
 *         description: Error handler.
 */
router.post("/create",
    async (req: Request, res: Response) => {
        return res.status(200).send(await products.test());
    }
);


/**
 * @swagger
 * /api/products/:
 *   get:
 *     tags: [Products]
 *     summary: List all available products.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array containing products' metadata.
 *       500:
 *         description: Error handler.
 */
router.get("/",
    async (req: Request, res: Response) => {
        return res.status(200).send(1);
    }
);


/**
 * @swagger
 * /api/products/:productId
 *   get:
 *     tags: [Products]
 *     summary: Display information about a specific product.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: productId
 *        in: path
 *        required: true
 *        description: The Product's ID.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: An object representing the product's metadata.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Error handler.
 */
router.get("/:productId",
    async (req: Request, res: Response) => {
        return res.status(200).send(1);
    }
);


/**
 * @swagger
 * /api/products/trending
 *   get:
 *     tags: [Products]
 *     summary: List the most popular products.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: limit
 *        in: query
 *        required: false
 *        description: The limit of occurrences.
 *        default: 5
 *        schema:
 *          type: number
 *     responses:
 *       200:
 *         description: An array of products.
 *       500:
 *         description: Error handler.
 */
router.get("/trending",
    async (req: Request, res: Response) => {
        return res.status(200).send(1);
    }
);


/**
 * @swagger
 * /api/products/categories/:categoryId
 *   get:
 *     tags: [Products]
 *     summary: List the products from a given category.
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: categoryId
 *        in: path
 *        required: true
 *        description: The target Category ID.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: An array of products from a given category.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Error handler.
 */
router.get("/trending",
    async (req: Request, res: Response) => {
        return res.status(200).send(await products.test());
    }
);


export default router;