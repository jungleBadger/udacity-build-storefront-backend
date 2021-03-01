
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import products from "../../../src/helpers/products";
import faker from "faker";
import {Op} from "sequelize";

const VALID_MODEL: any = {
    "name": faker.commerce.productName(),
    "description": faker.commerce.productDescription(),
    "price": Number(faker.commerce.price()),
    "categoryId": 1
};


describe("[Product] - createProduct method testing", function() {
    
    // beforeAll(async () => {
    //     // create base admin user
    //     createdUserModel = await products.createProduct(
    //         VALID_MODEL.username,
    //         VALID_MODEL.firstName,
    //         VALID_MODEL.lastName,
    //         VALID_MODEL.rawPassword
    //     );
    // });

    afterAll(async () => {
        // delete base admin user
        await products.Product.destroy({
            "where": {
                "id": {
                    [Op.ne]: 1
                }
            }
        });
    });


    it("should fail if the `name` param is not available", async (done) => {
        try {
            await products.createProduct(
                "",
                VALID_MODEL.description,
                VALID_MODEL.price,
                VALID_MODEL.categoryId
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product properties."
            })));
            return done();
        }
    });

    it("should fail if the `price` param is negative", async (done) => {
        try {
            await products.createProduct(
                VALID_MODEL.name,
                VALID_MODEL.description,
                -1,
                VALID_MODEL.categoryId
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid price value."
            })));
            return done();
        }
    });

    it("should fail if the `categoryId` param is not available", async (done) => {
        try {
            await products.createProduct(
                VALID_MODEL.name,
                VALID_MODEL.description,
                VALID_MODEL.price,
                0
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product properties."
            })));
            return done();
        }
    });

    it("should fail if the `categoryId` param is not from an existent category", async (done) => {
        const INVALID_CATEGORY_ID = 999999;
        try {
            await products.createProduct(
                VALID_MODEL.name,
                VALID_MODEL.description,
                VALID_MODEL.price,
                INVALID_CATEGORY_ID
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 409,
                "message": `Category ${INVALID_CATEGORY_ID} doesn't exist.`
            })));
            return done();
        }
    });

    
    it("should create the Product",async (done) => {
        const newProductName = faker.commerce.productName();
        const newProduct: any = await products.createProduct(
            newProductName,
            VALID_MODEL.description,
            VALID_MODEL.price,
            VALID_MODEL.categoryId
        );

        expect(
            newProduct
        ).toBeInstanceOf(
            Object
        );

        expect(
            newProduct.name
        ).toEqual(newProductName);

        expect(
            newProduct.description
        ).toEqual(VALID_MODEL.description);

        expect(
            newProduct.categoryId
        ).toEqual(VALID_MODEL.categoryId);

        return done();

    });

});