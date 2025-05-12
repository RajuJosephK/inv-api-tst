import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

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

	setToken(token) {
		this.authToken = token;
		this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}

	async handleRequest(requestFn) {
		try {
			return await requestFn();
		} catch (error) {
			if (error.response) return error.response;
			throw error;
		}
	}
}
