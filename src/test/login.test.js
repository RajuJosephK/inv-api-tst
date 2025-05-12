import { LoginService } from "../services/LoginService.js";
import { TestUsers } from "../data/TestUsers.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

const loginService = new LoginService();
const logger = new WinstonLogger();

describe("Authentication", () => {
	it("should login successfully with valid credentials", async () => {
		logger.info("Starting login test with valid credentials");

		try {
			const res = await loginService.login(
				TestUsers.validUser1.username,
				TestUsers.validUser1.password
			);
			expect(res.status).to.equal(200);
			expect(res.data.message).to.equal("user01 logged in successful");
			expect(res.data).to.have.property("token").and.is.not.empty;

			logger.info("Login test passed successfully with valid credentials.");
		} catch (error) {
			logger.error(
				`Login test failed with valid credentials: ${error.message}`
			);
			throw error;
		}
	});

	it("should reject invalid credentials with 400", async () => {
		logger.info("Starting login test with invalid credentials");

		try {
			const res = await loginService.login(
				TestUsers.invalidUser.username,
				TestUsers.invalidUser.password
			);
			expect(res.status).to.equal(400);
			expect(res.data.message).to.equal("Invalid credentials");

			logger.info(
				"Login test passed for invalid credentials with expected failure."
			);
		} catch (error) {
			logger.error(
				`Login test failed with invalid credentials: ${error.message}`
			);
			throw error;
		}
	});

	it("should return 400 if username or password is missing", async () => {
		logger.info("Starting login test with missing username");

		try {
			const res = await loginService.login("", TestUsers.validUser1.password);
			expect(res.status).to.equal(400);
			expect(res.data.message).to.equal("Invalid credentials");

			logger.info(
				"Login test passed for missing username with expected failure."
			);
		} catch (error) {
			logger.error(`Login test failed for missing username: ${error.message}`);
			throw error;
		}
	});
});
