
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import products from "../../../src/helpers/products";
import faker from "faker";
import {Op} from "sequelize";


describe("[Product] - retrieveProductsByCategory method testing", function() {
    
    beforeAll(async () => {
        // create base admin user
        await Promise.all([
            products.createProduct(
                faker.commerce.productName(),
                faker.commerce.productDescription(),
                Number(faker.commerce.price()),
                1
            ),
            products.createProduct(
                faker.commerce.productName(),
                faker.commerce.productDescription(),
                Number(faker.commerce.price()),
                1
            )
        ]);
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


    it("should throw an error if `categoryId` aren't present or is invalid", async (done) => {

        try {
            await products.retrieveProductsByCategory(0);
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid Category ID."
            })));
        }
        try {
            await products.retrieveProductsByCategory(-1);
        } catch (e) {
            expect(e).toEqual(new Error(JSON.stringify({
                "status": 400,
                "message": "Invalid Category ID."
            })));
        }

        await products.retrieveProductsByCategory(1);

        return done();
    });

    it("should correctly apply the limit of fetched items", async (done) => {
        let productsList = await products.retrieveProductsByCategory(1, 1);
        expect(Array.isArray(productsList)).toBeTruthy();
        expect(productsList.length).toEqual(1);

        let secondProductsList = await products.retrieveProductsByCategory(1, 2);
        expect(Array.isArray(secondProductsList)).toBeTruthy();
        expect(secondProductsList.length >= 2).toBeTruthy();
        done();
    });

    it("should correctly apply the offset on fetched items", async (done) => {
        let productsList = await products.retrieveProductsByCategory(1,1);
        expect(Array.isArray(productsList)).toBeTruthy();


        let secondProductsList = await products.retrieveProductsByCategory(1, 1, 1);
        expect(Array.isArray(secondProductsList)).toBeTruthy();

        expect(JSON.stringify(productsList) !== JSON.stringify(secondProductsList)).toBeTruthy();
        done();
    });

    it("should correctly apply the sort on fetched items", async (done) => {
        let productsList = await products.retrieveProductsByCategory(1, 1, 0, ["id", "ASC"]);
        expect(Array.isArray(productsList)).toBeTruthy();
        expect(productsList.length).toEqual(1);

        let secondProductsList = await products.retrieveProductsByCategory(1, 1, 0, ["id", "DESC"]);
        expect(Array.isArray(secondProductsList)).toBeTruthy();
        expect(secondProductsList.length).toEqual(1);

        expect(JSON.stringify(productsList) !== JSON.stringify(secondProductsList)).toBeTruthy();
        done();
    });


});