// Demonstrate the use of static test data

export class TestUsers {
	static validUser1 = { username: "user01", password: "secpassword*" };
	static validUser2 = { username: "user02", password: "secpassword*" };
	static invalidUser = { username: "wrongUser", password: "wrongPass" };
}
