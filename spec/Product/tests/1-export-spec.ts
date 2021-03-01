
import * as dotenv from "dotenv";
let dotEnvProps: Object = {};
dotenv.config(dotEnvProps);
import products from "../../../src/helpers/products";

describe("[Product] - Valid helper import",() => {

    it("should offer a JSON-like interface",() => {
        expect(
            products
        ).toBeInstanceOf(Object);
    });

    it("should export the `Product` schema",() => {
        expect(
           products.hasOwnProperty("Product")
        ).toBeTruthy();

        expect(
            products.Product
        ).toBeInstanceOf(Function);
    });

    it("should export the `createProduct` method",() => {
        expect(
            products.hasOwnProperty("createProduct")
        ).toBeTruthy();

        expect(
            products.createProduct
        ).toBeInstanceOf(Function);
    });

});