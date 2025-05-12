import { HealthCheckService } from "../services/HealthCheckService.js";
import { AuthClient } from "../utils/AuthClient.js";
import { AuthService } from "../services/AuthService.js";
import * as chai from "chai";
import chaiHttp from "chai-http";
import { WinstonLogger } from "../utils/WinstonLogger.js"; // Import logger

chai.use(chaiHttp);
const { expect } = chai;

// Create an instance of AuthClient
const authClient = new AuthClient();
const authService = new AuthService(authClient);
const healthCheckService = new HealthCheckService(authClient);

// Initialise logger
const logger = new WinstonLogger();

describe("should return OK status for API and database connection", () => {
	before(async () => {
		logger.info("Starting authentication process before tests...");

		try {
			await authService.initAuth(); // Get token before tests
		} catch (error) {
			logger.error("Authentication process failed: " + error.message);
			throw error;
		}
	});

	describe("GET / Check the status of API and DB", () => {
		it("Get the api health and DB check", async () => {
			logger.info("Initiating health check request...");

			try {
				const result = await healthCheckService.healthCheck();

				// Assertions
				expect(result.status).to.equal(200);
				expect(result.data.status).to.equal("OK");
				expect(result.data.dbStatus).to.equal("Connected");
			} catch (error) {
				logger.error("Health check failed: " + error.message);
				throw error;
			}
		});
	});
});
