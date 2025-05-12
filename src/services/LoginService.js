import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class LoginService {
	constructor() {
		this.baseUrl = process.env.BASE_URL;
	}

	async login(username, password) {
		const loginUrl = `${this.baseUrl}/auth/login`;
		try {
			const response = await axios.post(loginUrl, { username, password });
			return response;
		} catch (error) {
			if (error.response) return error.response;
			throw error;
		}
	}
}
