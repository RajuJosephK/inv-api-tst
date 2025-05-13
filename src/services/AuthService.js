import { LoginService } from "./LoginService.js";
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
	async initAuth(username, password) {
		try {
			this.logger.info("Initialising authentication process...");

			const response = await this.loginService.login(username, password);

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
