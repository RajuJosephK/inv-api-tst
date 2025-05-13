import { AuthClient } from "../utils/AuthClient.js";
import { AuthService } from "../services/AuthService.js";
import { ProductService } from "../services/ProductService.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";
import { TestUsers } from "../data/TestUsers.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

// Initialize services
const authClient = new AuthClient();
const authService = new AuthService(authClient);
const productService = new ProductService(authClient);
const logger = new WinstonLogger();

const expectValidProduct = (product) => {
	expect(product).to.have.property("productId");
	expect(product).to.have.property("name");
	expect(product).to.have.property("price");
	expect(product).to.have.property("quantity");
	expect(product).to.have.property("productType");
	expect(product).to.have.property("createdAt");
};

describe("Product CRUD Operations", () => {
	before(async () => {
		logger.info("Authenticating test user...");
		await authService.initAuth(
			TestUsers.validUser1.username,
			TestUsers.validUser1.password
		);
	});

	describe("GET /products", () => {
		it("should fetch all products with required fields", async () => {
			logger.info("Fetching all products...");
			const result = await productService.fetchAllProducts();
			expect(result.status).to.equal(200);
			expect(result.data).to.be.an("array");
			result.data.forEach(expectValidProduct);
		});

		it("should fetch a single product by ID with valid data", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info(`Fetching product by ID: ${product.productId}...`);

			const result = await productService.fetchProductById(product.productId);
			expect(result.status).to.equal(200);
			expectValidProduct(result.data);
			expect(result.data.productId).to.equal(product.productId);
		});

		it("should return 404 when product ID does not exist", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info("Fetching product with invalid ID...");
			const result = await productService.fetchProductById(
				product.productId + "-invalid"
			);
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");
		});
	});

	describe("POST /products", () => {
		it("should create a new product with default values", async () => {
			logger.info("Creating a product with default values...");
			const result = await productService.createProductRequest();

			expect(result.status).to.equal(201);
			expectValidProduct(result.data);
			expect(result.data.name).to.match(/^Product_\d+$/);
			expect(result.data.price).to.be.greaterThan(0);
		});

		it("should not allow creation of a product with duplicate name and type", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info(
				`Attempting to create duplicate product: ${product.name}, ${product.productType}...`
			);

			const result = await productService.createProductRequest({
				name: product.name,
				productType: product.productType,
			});
			expect(result.status).to.equal(400);
			expect(result.data.message).to.equal(
				"Product with this name and type already exists"
			);
		});

		describe("Validation errors", () => {
			it("should return error for zero price", async () => {
				logger.info("Creating product with price 0...");
				const result = await productService.createProductRequest({ price: 0 });
				expect(result.status).to.equal(400);
				expect(result.data.message).to.equal("Price must be greater than 0");
			});

			it("should return error for negative price", async () => {
				logger.info("Creating product with negative price...");
				const result = await productService.createProductRequest({
					price: -1.11,
				});
				expect(result.status).to.equal(400);
				expect(result.data.message).to.equal("Price must be greater than 0");
			});
		});
	});

	describe("PUT /products/:id", () => {
		it("should update an existing product", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info(`Updating product ID: ${product.productId}...`);

			const updated = {
				name: `${product.name}-updated`,
				price: product.price + 1,
				productType: product.productType,
				quantity: product.quantity + 1,
			};

			const result = await productService.updateProduct(
				updated,
				product.productId
			);

			expect(result.status).to.equal(200);
			expect(result.data.name).to.equal(updated.name);
			expect(result.data.price).to.equal(updated.price);
			expect(result.data.quantity).to.equal(updated.quantity);
		});

		it("should return 404 when updating a non-existing product", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info("Updating product with invalid ID...");
			const result = await productService.updateProduct(
				{ name: "Invalid", price: 10 },
				product.productId + "-invalid"
			);
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");
		});
	});

	describe("DELETE /products/:id", () => {
		it("should delete an existing product", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info(`Deleting product ID: ${product.productId}...`);
			const result = await productService.deleteProduct(product.productId);

			expect(result.status).to.equal(200);
			expect(result.data.message).to.equal("Product removed");
		});

		it("should return 404 when deleting a non-existing product", async () => {
			const product = await productService.fetchRandomProduct();
			logger.info("Deleting product with invalid ID...");
			const result = await productService.deleteProduct(
				product.productId + "-invalid"
			);
			expect(result.status).to.equal(404);
			expect(result.data.message).to.equal("Product not found");
		});
	});

	describe("Auth token handling", () => {
		it("should return 401 Unauthorized when using an invalid token", async () => {
			logger.info("Setting invalid token...");
			authClient.setToken("InvalidToken123");

			const result = await productService.createProductRequest();
			expect(result.status).to.equal(401);
			expect(result.data.message).to.equal("Invalid token");
		});
	});
});
