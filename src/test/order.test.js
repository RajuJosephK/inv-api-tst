// import { createProductRequest } from "../services/productService.js";
import { OrderService } from "../services/OrderService.js";
import { AuthClient } from "../utils/authClient.js";
import { AuthService } from "../services/AuthService.js";
import { ProductService } from "../services/ProductService.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

// Create an instance of AuthClient
const authClient = new AuthClient();
const authService = new AuthService(authClient);
const productService = new ProductService(authClient);
const orderService = new OrderService(authClient);
let productId_Seed = "";

describe("Order and Stock Management", () => {
	before(async () => {
		await authService.initAuth(); // Initialize authentication and set token
	});

	describe("Seed Product Data", () => {
		it("should create a order for stock management tests", async () => {
			const result = await productService.createProductRequest();
			expect(
				result.status,
				"Expected status 201 for product creation"
			).to.equal(201);
			productId_Seed = result.data.productId;
		});
	});

	describe("Buy Orders", () => {
		it("should successfully create a buy order", async () => {
			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: 100,
			});
			expect(result.status).to.equal(201);
			expect(result.data.orderType).to.equal("buy");
			expect(result.data.quantity).to.equal(100);
		});

		it("should reject buy order with quantity 0", async () => {
			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: 0,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);
		});

		it("should reject buy order with negative quantity", async () => {
			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: -100,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);
		});

		it("should return 404 for non-existent product", async () => {
			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: `${productId_Seed}_Invalid`,
				quantity: 100,
			});
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");
		});
	});

	describe("Sell Orders", () => {
		it("should create a sell order within available stock", async () => {
			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: 10,
			});
			expect(result.status).to.equal(201);
			expect(result.data.orderType).to.equal("sell");
			expect(result.data.quantity).to.equal(10);
		});

		it("should reject sell order with quantity 0", async () => {
			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: 0,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);
		});

		it("should reject sell order with negative quantity", async () => {
			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: -100,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);
		});

		it("should reject sell order exceeding stock", async () => {
			const stockRes = await orderService.fetchProductStock(productId_Seed);
			const excessiveQuantity = stockRes.data.currentStock + 1;

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: excessiveQuantity,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal("Insufficient stock for sale");
		});

		it("should return 404 for non-existent product", async () => {
			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: `${productId_Seed}_Invalid`,
				quantity: 100,
			});
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");
		});
	});

	describe("Stock Checks", () => {
		it("should return current stock for valid product", async () => {
			const result = await orderService.fetchProductStock(productId_Seed);
			expect(result.status).to.equal(200);
			expect(result.data).to.have.property("currentStock");
		});

		it("should return 404 for stock check of invalid product", async () => {
			const result = await orderService.fetchProductStock(
				`${productId_Seed}_invalid`
			);
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("No orders found for this product");
		});
	});
});
