"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();
import products from "../../helpers/products";
import {parseJWT, validateJWT} from "../middlewares/auth";


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
 *      - name: description
 *        in: body
 *        required: false
 *        description: The Product's description.
 *        schema:
 *          type: string
 *      - name: price
 *        in: body
 *        required: true
 *        description: The Product's price.
 *        schema:
 *          type: number
 *      - name: categoryId
 *        in: body
 *        required: true
 *        description: The Product's category.
 *        schema:
 *          type: number
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
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
        return res.status(201).send(await products.createProduct(
            req.body.name,
            req.body.description,
            req.body.price,
            req.body.categoryId
        ));
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
        return res.status(200).send(
            await products.retrieveAllProductsInfo()
        );
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
        return res.status(200).send(
            await products.retrieveProductInfo(
                {
                    "id": Number(req.params.productId)
                }
            )
        );

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
 *      - name: limit
 *        in: query
 *        required: false
 *        description: The limit parameter.
 *        default: 10
 *        schema:
 *          type: string
 *      - name: offset
 *        in: query
 *        required: false
 *        description: The offset parameter.
 *        default: 0
 *        schema:
 *          type: string
 *      - name: orderBy
 *        in: query
 *        required: false
 *        description: The order field.
 *        default: name
 *        schema:
 *          type: string
 *      - name: orderDirection
 *        in: query
 *        required: false
 *        description: The order direction.
 *        default: ASC
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
router.get("/categories/:categoryId",
    async (req: Request, res: Response) => {
        return res.status(200).send(
            await products.retrieveProductsByCategory(
                Number(req.params.categoryId),
                Number(req.query.limit || 10),
                Number(req.query.offset || 0),
                [req.query.orderBy as string || "name", (req.query.orderDirection as string || "ASC").toUpperCase()]
            )
        );
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
        return res.status(200).send(
            await products.retrieveProductsByCategory(
                Number(req.params.categoryId),
                Number(req.query.limit || 10),
                Number(req.query.offset || 0),
                ["", (req.query.orderDirection as string || "ASC").toUpperCase()]
            )
        );
    }
);



/**
 * @swagger
 * /api/products/:productId
 *   delete:
 *     tags: [Products]
 *     summary: Delete a specific product.
 *     security:
 *      - bearerAuth: []
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
 *         description: Operation status.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Error handler.
 */
router.delete("/:productId",
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
        return res.status(200).send(
            await products.deleteProduct(Number(req.params.productId))
        );
    }
);


export default router;