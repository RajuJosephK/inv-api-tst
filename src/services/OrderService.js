import { AuthClient } from "../utils/authClient.js";

export class OrderService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient;
	}

	// Create an order (buy or sell)
	async placeOrder(orderDetails) {
		return this.client.handleRequest(() =>
			this.client.client.post("/orders", orderDetails)
		);
	}

	// Get stock details by product ID
	async fetchProductStock(productId) {
		if (!productId) throw new Error("Product ID is required");
		return this.client.handleRequest(() =>
			this.client.client.get(`/orders/product/${productId}`)
		);
	}
}
