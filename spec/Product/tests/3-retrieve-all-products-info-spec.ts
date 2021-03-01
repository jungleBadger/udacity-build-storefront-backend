
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import products from "../../../src/helpers/products";
import faker from "faker";
import {Op} from "sequelize";


describe("[Product] - retrieveAllProductsInfo method testing", function() {
    
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


    it("should retrieve a list of products", async (done) => {
        let productsList = await products.retrieveAllProductsInfo();
        expect(Array.isArray(productsList)).toBeTruthy();
        done();
    });

    it("should correctly apply the limit of fetched items", async (done) => {
        let productsList = await products.retrieveAllProductsInfo(1);
        expect(Array.isArray(productsList)).toBeTruthy();
        expect(productsList.length).toEqual(1);

        let secondProductsList = await products.retrieveAllProductsInfo(2);
        expect(Array.isArray(secondProductsList)).toBeTruthy();
        expect(secondProductsList.length).toEqual(2);
        done();
    });

    it("should correctly apply the offset on fetched items", async (done) => {
        let productsList = await products.retrieveAllProductsInfo(1);
        expect(Array.isArray(productsList)).toBeTruthy();
        expect(productsList.length).toEqual(1);

        let secondProductsList = await products.retrieveAllProductsInfo(1, 1);
        expect(Array.isArray(secondProductsList)).toBeTruthy();
        expect(secondProductsList.length).toEqual(1);

        expect(JSON.stringify(productsList) !== JSON.stringify(secondProductsList)).toBeTruthy();
        done();
    });

    it("should correctly apply the sort on fetched items", async (done) => {
        let productsList = await products.retrieveAllProductsInfo(1, 0, ["id", "ASC"]);
        expect(Array.isArray(productsList)).toBeTruthy();
        expect(productsList.length).toEqual(1);

        let secondProductsList = await products.retrieveAllProductsInfo(1, 0, ["id", "DESC"]);
        expect(Array.isArray(secondProductsList)).toBeTruthy();
        expect(secondProductsList.length).toEqual(1);

        expect(JSON.stringify(productsList) !== JSON.stringify(secondProductsList)).toBeTruthy();
        done();
    });


});