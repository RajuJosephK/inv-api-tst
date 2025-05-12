import axios from "axios";
import dotenv from "dotenv";
import { WinstonLogger } from "../utils/WinstonLogger.js"; // Importing the logger

dotenv.config();

// Initialise the logger
const logger = new WinstonLogger();

export class AuthClient {
	constructor() {
		this.authToken = null;
		this.client = axios.create({
			baseURL: process.env.BASE_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// Set the authentication token and update the axios client headers
	setToken(token) {
		this.authToken = token;
		this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		logger.info("Authentication token has been set.");
	}

	// Handle requests with logging for success or failure
	async handleRequest(requestFn) {
		try {
			logger.info("Making request...");

			const response = await requestFn();
			return response;
		} catch (error) {
			if (error.response) {
				logger.error(
					`Request failed with status ${error.response.status}: ${error.response.data}`
				);
				return error.response;
			}
			logger.error(`Request failed: ${error.message}`);
			throw error;
		}
	}
}
