import { AuthClient } from "../utils/authClient.js"; // AuthClient to manage authenticated requests

export class ProductService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient; // Authenticated client
	}

	// Utility to create a mock product with overrides
	createProduct(overrides = {}) {
		return {
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
	}

	// Fetch all products
	async fetchAllProducts() {
		return this.client.handleRequest(() => this.client.client.get("/products"));
	}

	// Fetch one random product from the list
	async fetchRandomProduct() {
		const { data: products } = await this.fetchAllProducts();

		if (!Array.isArray(products) || products.length === 0) {
			throw new Error("No products found");
		}

		return products[Math.floor(Math.random() * products.length)];
	}

	// Fetch a specific product by ID
	async fetchProductById(id) {
		if (!id) throw new Error("Product ID is required");
		return this.client.handleRequest(() =>
			this.client.client.get(`/products/${id}`)
		);
	}

	// Create a new product
	async createProductRequest(overrides = {}) {
		const product = this.createProduct(overrides);
		return this.client.handleRequest(() =>
			this.client.client.post("/products", product)
		);
	}

	// Update an existing product
	async updateProduct(overrides = {}, id) {
		if (!id) throw new Error("Product ID is required");
		const product = this.createProduct(overrides);
		return this.client.handleRequest(() =>
			this.client.client.put(`/products/${id}`, product)
		);
	}

	// Delete a product
	async deleteProduct(id) {
		if (!id) throw new Error("Product ID is required");
		return this.client.handleRequest(() =>
			this.client.client.delete(`/products/${id}`)
		);
	}
}
