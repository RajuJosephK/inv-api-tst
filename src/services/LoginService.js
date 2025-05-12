import axios from "axios";
import dotenv from "dotenv";
import { WinstonLogger } from "../utils/WinstonLogger.js";

dotenv.config();

export class LoginService {
	constructor() {
		this.baseUrl = process.env.BASE_URL;
		this.logger = new WinstonLogger();
	}

	async login(username, password) {
		const loginUrl = `${this.baseUrl}/auth/login`;
		this.logger.info(`Attempting login for user: ${username}`);
		try {
			const response = await axios.post(loginUrl, { username, password });
			this.logger.info(`Login successful for user: ${username}`);
			return response;
		} catch (error) {
			if (error.response) {
				this.logger.warn(
					`Login failed for user: ${username} - Status: ${error.response.status}`
				);
				return error.response;
			}
			this.logger.error(
				`Unexpected error during login for user: ${username} - Error: ${error.message}`
			);
			throw error;
		}
	}
}
