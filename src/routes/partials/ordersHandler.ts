"use strict";

import {Router, Request, Response} from "express";
const router: Router = Router();
import orders from "../../helpers/orders";
import {parseJWT, validateJWT} from "../middlewares/auth";
import products from "../../helpers/products";
import orderProducts from "../../helpers/orderProducts";


/**
 *
 * @swagger
 * /api/products/create
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
        let order = await orders.createOrder(
            req.body.userId
        ) as any;
        return res.status(order.isNew ? 201 : 200).send(order);
    }
);


/**
 * @swagger
 * /api/orders/:orderId
 *   get:
 *     tags: [Orders]
 *     summary: Get the Current order of a given user.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: orderId
 *        in: path
 *        required: true
 *        description: The Order's ID.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: An object representing a given order.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: Order not found or order unavailable.
 *       500:
 *         description: Error handler.
 */
router.get("/:orderId",
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
      return res.status(200).send(
          await orders.retrieveOrderInfo({
              "id": Number(req.params.orderId)
          })
      );
    }
);


/**
 * @swagger
 * /api/orders/:orderId/product/add
 *   get:
 *     tags: [Orders]
 *     summary: Get the Current order of a given user.
 *     security:
 *      - ApiKeyAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: orderId
 *        in: path
 *        required: true
 *        description: The Order's ID.
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: An object representing a given order.
 *       401:
 *         description: Invalid API token.
 *       403:
 *         description: Expired or denied API token.
 *       404:
 *         description: Order not found or order unavailable.
 *       500:
 *         description: Error handler.
 */
router.post("/:orderId/product/add",
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
      return res.status(201).send(
          await orderProducts.createOrderProduct(
              Number(req.body.productId),
              Number(req.body.productQuantity),
              Number(req.params.orderId)
          )
      );
    }
);


/**
 * @swagger
 * /api/orders/byUser/:userId/active
 *   get:
 *     tags: [Orders]
 *     summary: Get the Active order of a given user.
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
router.get("/byUser/:userId/active",
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
      return res.status(200).send(
          await orders.retrieveActiveOrderFromUser(Number(req.params.userId), false)
      );
    }
);



/**
 * @swagger
 * /api/orders/:userId/current
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
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
      return res.status(200).send(
          await orders.retrieveOrdersByUser(Number(req.params.userId))
      );
    }
);

/**
 * @swagger
 * /api/orders/:userId/completed
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
    parseJWT,
    validateJWT,
    async (req: Request, res: Response) => {
      return res.status(200).send(1);
    }
);

export default router;