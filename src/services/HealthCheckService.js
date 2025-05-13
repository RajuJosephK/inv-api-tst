import { AuthClient } from "../utils/AuthClient.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";

// Initialise the logger
const logger = new WinstonLogger();

export class HealthCheckService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient;
		this.logger = logger;
	}

	// Check the health of the API and DB
	async healthCheck() {
		try {
			this.logger.info("Initialising healthCheck...");

			const response = await this.client.handleRequest(() =>
				this.client.client.get("/status")
			);

			this.logger.info(
				`Health check successful: ${JSON.stringify(response.data)}`
			);

			return response;
		} catch (error) {
			this.logger.error(`Health check failed: ${error.message}`);
			throw error;
		}
	}
}
