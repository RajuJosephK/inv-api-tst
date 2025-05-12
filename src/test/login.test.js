import { LoginService } from "../services/LoginService.js";
import { TestUsers } from "../data/TestUsers.js";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const { expect } = chai;

const loginService = new LoginService();

describe("Authentication", () => {
	it("should login successfully with valid credentials", async () => {
		const res = await loginService.login(
			TestUsers.validUser1.username,
			TestUsers.validUser1.password
		);
		expect(res.status).to.equal(200);
		expect(res.data.message).to.equal("user01 logged in successful");
		expect(res.data).to.have.property("token").and.is.not.empty;
	});

	it("should reject invalid credentials with 400", async () => {
		const res = await loginService.login(
			TestUsers.invalidUser.username,
			TestUsers.invalidUser.password
		);
		expect(res.status).to.equal(400);
		expect(res.data.message).to.equal("Invalid credentials");
	});

	it("should return 400 if username or password is missing", async () => {
		const res = await loginService.login("", TestUsers.validUser1.password);
		expect(res.status).to.equal(400);
		expect(res.data.message).to.equal("Invalid credentials");
	});
});
