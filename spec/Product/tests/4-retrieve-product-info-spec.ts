
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


describe("[Product] - retrieveProductInfo method testing", function() {

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


    it("should throw an error if `query.id` aren't present", async (done) => {

        try {
            await products.retrieveProductInfo({
                "id": 0
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid query options."
            })));
        }
        
        await products.retrieveProductInfo({
            "id": createdProductModel.id
        })
        
        return done();
    });

    it("should retrieve the previously created user by ID", async (done) => {
        let userInfo = await products.retrieveProductInfo({
            "id": createdProductModel.id
        }) as any;
        expect(userInfo).toBeTruthy();
        expect(userInfo.id === createdProductModel.id).toBeTruthy();
        expect(userInfo.name === createdProductModel.name).toBeTruthy();
        done();
    });

    it("should throw a 404 error if ID is not found", async (done) => {
        const INVALID_ID = 1111111111;
        try {
            await products.retrieveProductInfo({
                "id": INVALID_ID
            });
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 404,
                "message": `Product ${INVALID_ID} not found.`
            })));
            done();
        }
    });

    it("should return null if acceptNotFound flag is enabled", async (done) => {
        const INVALID_ID = 1111111111;
        let userInfo =  await products.retrieveProductInfo({
            "id": INVALID_ID
        }, true);

        expect(userInfo).toBeNull();
        done();
    });

});