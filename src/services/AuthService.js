import { LoginService } from "./LoginService.js";
import { TestUsers } from "../data/TestUsers.js";

export class AuthService {
	constructor(authClient) {
		this.authClient = authClient;
		this.loginService = new LoginService();
	}

	async initAuth() {
		const response = await this.loginService.login(
			TestUsers.validUser1.username,
			TestUsers.validUser1.password
		);
		if (response.status === 200 && response.data.token) {
			this.authClient.setToken(response.data.token);
		} else {
			throw new Error("Authentication failed");
		}
	}
}
