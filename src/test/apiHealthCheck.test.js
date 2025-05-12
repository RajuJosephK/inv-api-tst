import { HealthCheckService } from "../services/HealthCheckService.js";
import { AuthClient } from "../utils/AuthClient.js";
import { AuthService } from "../services/AuthService.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

// Create an instance of AuthClient
const authClient = new AuthClient();
const authService = new AuthService(authClient);
const healthCheckService = new HealthCheckService(authClient);

describe("should return OK status for API and database connection", () => {
	before(async () => {
		await authService.initAuth(); // Get token before tests
	});

	describe("GET / Check the status of API and DB", () => {
		it("Get the api health and DB check ", async () => {
			const result = await healthCheckService.healthCheck();

			expect(result.status).to.equal(200);
			expect(result.data.status).to.equal("OK");
			expect(result.data.dbStatus).to.equal("Connected");
		});
	});
});
