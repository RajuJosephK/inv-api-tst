import { AuthClient } from "../utils/AuthClient.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";

// Initialise the logger
const logger = new WinstonLogger();

export class OrderService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient;
	}

	// Create an order (buy or sell)
	async placeOrder(orderDetails) {
		try {
			logger.info(`Placing order: ${JSON.stringify(orderDetails)}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.post("/orders", orderDetails)
			);

			logger.info(`Order placed successfully: ${response.data}`);

			return response;
		} catch (error) {
			logger.error(`Failed to place order: ${error.message}`);
			throw error;
		}
	}

	// Get stock details by product ID
	async fetchProductStock(productId) {
		if (!productId) throw new Error("Product ID is required");

		try {
			logger.info(`Fetching stock for product ID: ${productId}`);

			const response = await this.client.handleRequest(() =>
				this.client.client.get(`/orders/product/${productId}`)
			);

			logger.info(`Stock details fetched: ${JSON.stringify(response.data)}`);

			return response;
		} catch (error) {
			logger.error(`Failed to fetch product stock: ${error.message}`);
			throw error;
		}
	}
}
