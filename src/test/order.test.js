import { OrderService } from "../services/OrderService.js";
import { AuthClient } from "../utils/AuthClient.js";
import { AuthService } from "../services/AuthService.js";
import { ProductService } from "../services/ProductService.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

// Create an instance of AuthClient
const authClient = new AuthClient();
const authService = new AuthService(authClient);
const productService = new ProductService(authClient);
const orderService = new OrderService(authClient);
const logger = new WinstonLogger();
let productId_Seed = "";

describe("Order and Stock Management", () => {
	before(async () => {
		logger.info("Initializing authentication and setting token...");

		await authService.initAuth();
	});

	describe("Seed Product Data", () => {
		it("should create an order for stock management tests", async () => {
			logger.info("Creating product for stock management tests...");

			const result = await productService.createProductRequest();
			expect(
				result.status,
				"Expected status 201 for product creation"
			).to.equal(201);
			productId_Seed = result.data.productId;

			logger.info(`Product created with ID: ${productId_Seed}`);
		});
	});

	describe("Buy Orders", () => {
		it("should successfully create a buy order", async () => {
			logger.info("Creating a buy order for the product...");

			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: 100,
			});
			expect(result.status).to.equal(201);
			expect(result.data.orderType).to.equal("buy");
			expect(result.data.quantity).to.equal(100);

			logger.info("Buy order created successfully.");
		});

		it("should reject buy order with quantity 0", async () => {
			logger.info("Creating a buy order with quantity 0...");

			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: 0,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);

			logger.warn("Buy order with quantity 0 rejected as expected.");
		});

		it("should reject buy order with negative quantity", async () => {
			logger.info("Creating a buy order with negative quantity...");

			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: productId_Seed,
				quantity: -100,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);

			logger.warn("Buy order with negative quantity rejected as expected.");
		});

		it("should return 404 for non-existent product", async () => {
			logger.info("Creating a buy order for a non-existent product...");

			const result = await orderService.placeOrder({
				orderType: "buy",
				productId: `${productId_Seed}_Invalid`,
				quantity: 100,
			});
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");

			logger.warn("Buy order for non-existent product rejected as expected.");
		});
	});

	describe("Sell Orders", () => {
		it("should create a sell order within available stock", async () => {
			logger.info("Creating a sell order for the product...");

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: 10,
			});
			expect(result.status).to.equal(201);
			expect(result.data.orderType).to.equal("sell");
			expect(result.data.quantity).to.equal(10);

			logger.info("Sell order created successfully.");
		});

		it("should reject sell order with quantity 0", async () => {
			logger.info("Creating a sell order with quantity 0...");

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: 0,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);

			logger.warn("Sell order with quantity 0 rejected as expected.");
		});

		it("should reject sell order with negative quantity", async () => {
			logger.info("Creating a sell order with negative quantity...");

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: -100,
			});

			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Quantity must be a positive number"
			);

			logger.warn("Sell order with negative quantity rejected as expected.");
		});

		it("should reject sell order exceeding stock", async () => {
			logger.info(
				"Checking stock and creating a sell order exceeding available stock..."
			);

			const stockRes = await orderService.fetchProductStock(productId_Seed);
			const excessiveQuantity = stockRes.data.currentStock + 1;

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: productId_Seed,
				quantity: excessiveQuantity,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal("Insufficient stock for sale");

			logger.warn("Sell order exceeding stock rejected as expected.");
		});

		it("should return 404 for non-existent product", async () => {
			logger.info("Creating a sell order for a non-existent product...");

			const result = await orderService.placeOrder({
				orderType: "sell",
				productId: `${productId_Seed}_Invalid`,
				quantity: 100,
			});
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");

			logger.warn("Sell order for non-existent product rejected as expected.");
		});
	});

	describe("Stock Checks", () => {
		it("should return current stock for valid product", async () => {
			logger.info("Fetching current stock for valid product...");

			const result = await orderService.fetchProductStock(productId_Seed);
			expect(result.status).to.equal(200);
			expect(result.data).to.have.property("currentStock");

			logger.info("Stock check for valid product successful.");
		});

		it("should return 404 for stock check of invalid product", async () => {
			logger.info("Fetching stock for invalid product...");

			const result = await orderService.fetchProductStock(
				`${productId_Seed}_invalid`
			);
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("No orders found for this product");

			logger.warn("Stock check for invalid product returned expected 404.");
		});
	});
});
