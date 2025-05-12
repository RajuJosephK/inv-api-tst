import { AuthClient } from "../utils/AuthClient.js"; // AuthClient to manage authenticated requests
import { WinstonLogger } from "../utils/WinstonLogger.js"; // Importing the WinstonLogger

// Initialise the logger
const logger = new WinstonLogger();

export class ProductService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient;
	}

	// Utility to create a mock product with overrides
	createProduct(overrides = {}) {
		const product = {
			name: `Product_${Date.now()}`,
			price: +(Math.random() * (100 - 10) + 10).toFixed(2),
			productType: [
				"games",
				"computer accessory",
				"laptops",
				"miscellaneous",
				"mobile",
			][Math.floor(Math.random() * 5)],
			quantity: Math.floor(Math.random() * 50) + 1,
			...overrides,
		};

		logger.info(`Created mock product: ${JSON.stringify(product)}`);
		return product;
	}

	// Fetch all products
	async fetchAllProducts() {
		try {
			logger.info("Fetching all products...");

			const response = await this.client.handleRequest(() =>
				this.client.client.get("/products")
			);

			logger.info(`Fetched all products: ${JSON.stringify(response.data)}`);
			return response;
		} catch (error) {
			logger.error(`Failed to fetch all products: ${error.message}`);
			throw error;
		}
	}

	// Fetch one random product from the list
	async fetchRandomProduct() {
		try {
			const { data: products } = await this.fetchAllProducts();

			if (!Array.isArray(products) || products.length === 0) {
				throw new Error("No products found");
			}

			const randomProduct =
				products[Math.floor(Math.random() * products.length)];
			logger.info(`Fetched random product: ${JSON.stringify(randomProduct)}`);
			return randomProduct;
		} catch (error) {
			logger.error(`Failed to fetch random product: ${error.message}`);
			throw error;
		}
	}

	// Fetch a specific product by ID
	async fetchProductById(id) {
		if (!id) throw new Error("Product ID is required");

		try {
			logger.info(`Fetching product by ID: ${id}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.get(`/products/${id}`)
			);

			logger.info(
				`Fetched product by ID ${id}: ${JSON.stringify(response.data)}`
			);
			return response;
		} catch (error) {
			logger.error(`Failed to fetch product by ID ${id}: ${error.message}`);
			throw error;
		}
	}

	// Create a new product
	async createProductRequest(overrides = {}) {
		const product = this.createProduct(overrides);

		try {
			logger.info(`Creating product: ${JSON.stringify(product)}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.post("/products", product)
			);

			logger.info(
				`Product created successfully: ${JSON.stringify(response.data)}`
			);

			return response;
		} catch (error) {
			logger.error(`Failed to create product: ${error.message}`);
			throw error;
		}
	}

	// Update an existing product
	async updateProduct(overrides = {}, id) {
		if (!id) throw new Error("Product ID is required");

		const product = this.createProduct(overrides);

		try {
			logger.info(`Updating product ID ${id}: ${JSON.stringify(product)}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.put(`/products/${id}`, product)
			);

			logger.info(
				`Product ID ${id} updated successfully: ${JSON.stringify(
					response.data
				)}`
			);
			return response;
		} catch (error) {
			logger.error(`Failed to update product ID ${id}: ${error.message}`);
			throw error;
		}
	}

	// Delete a product
	async deleteProduct(id) {
		if (!id) throw new Error("Product ID is required");

		try {
			logger.info(`Deleting product ID ${id}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.delete(`/products/${id}`)
			);

			logger.info(`Product ID ${id} deleted successfully`);
			return response;
		} catch (error) {
			logger.error(`Failed to delete product ID ${id}: ${error.message}`);
			throw error;
		}
	}
}
