
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import users from "../../../src/helpers/users";
import {Op} from "sequelize";
import products from "../../../src/helpers/products";
import faker from "faker";

const VALID_MODEL: any = {
    "name": faker.commerce.productName(),
    "description": faker.commerce.productDescription(),
    "price": Number(faker.commerce.price()),
    "categoryId": 1
};

let createdProductModel: any;


describe("[Product] - deleteProduct method testing", function() {

    beforeAll(async () => {
        // create base admin user
        createdProductModel = await products.createProduct(
            VALID_MODEL.name,
            VALID_MODEL.description,
            VALID_MODEL.price,
            VALID_MODEL.categoryId
        );
    });

    afterAll(async () => {
        await products.Product.destroy({
            "where": {
                "id": {
                    [Op.ne]: 1
                }
            }
        });
    });


    it("should throw an error if user ID is not valid", async (done) => {
        const INVALID_ID = 0;
        try {
            await products.deleteProduct(
                INVALID_ID
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Missing Product ID."
            })));
            return done();
        }
    });

    it("should throw an error if product ID is not found", async (done) => {
        const NOT_EXISTENT_ID = 111111;
        try {
            await products.deleteProduct(
                NOT_EXISTENT_ID
            );
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 404,
                "message": `Product ${NOT_EXISTENT_ID} not found.`
            })));
            return done();
        }
    });

    it("should delete the previously created product", async (done) => {
        let operationStatus = await products.deleteProduct(
            createdProductModel.id
        );
        expect(operationStatus).toEqual(`Product ${createdProductModel.id} deleted.`)
        done();
    });


});