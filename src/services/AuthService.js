import { LoginService } from "./LoginService.js";
import { TestUsers } from "../data/TestUsers.js";
import { WinstonLogger } from "../utils/WinstonLogger.js";

// Initialise the logger
const logger = new WinstonLogger();

export class AuthService {
	constructor(authClient) {
		this.authClient = authClient;
		this.loginService = new LoginService();
		this.logger = logger;
	}

	// Initialise the authentication process
	async initAuth() {
		try {
			this.logger.info("Initialising authentication process...");

			const response = await this.loginService.login(
				TestUsers.validUser1.username,
				TestUsers.validUser1.password
			);

			if (response.status === 200 && response.data.token) {
				this.authClient.setToken(response.data.token);
				this.logger.info("Authentication successful.");
			} else {
				this.logger.error(
					"Authentication failed: Invalid credentials or no token returned."
				);
				throw new Error("Authentication failed");
			}
		} catch (error) {
			this.logger.error(`Authentication process failed: ${error.message}`);
			throw error;
		}
	}
}
