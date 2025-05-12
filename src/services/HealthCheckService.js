import { AuthClient } from "../utils/authClient.js";

export class HealthCheckService {
	constructor(authClient = new AuthClient()) {
		this.client = authClient;
	}

	// Check the health of the API and DB
	async healthCheck() {
		return this.client.handleRequest(() => this.client.client.get("/status"));
	}
}

// import client from "../utils/authClient.js";
// import { requestHandler } from "../utils/requestHandler.js";

// // Check the health of the API and DB
// export async function healthCheck() {
// 	return requestHandler(() => client.get("/status"));
// }
