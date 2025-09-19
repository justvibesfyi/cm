import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { sql } from "bun";
import { initializeDb } from "../../database";
import useAuth from "../auth.js";

describe("useAuth", () => {
	let originalDatabaseUrl: string | undefined;
	let auth: ReturnType<typeof useAuth>;

	beforeAll(async () => {
		process.env.DATABASE_URL = "sqlite::memory:";

		await initializeDb();

		auth = useAuth();
	});

	afterAll(() => {
		// Restore original DATABASE_URL
		if (originalDatabaseUrl !== undefined) {
			process.env.DATABASE_URL = originalDatabaseUrl;
		} else {
			delete process.env.DATABASE_URL;
		}
	});

	beforeEach(async () => {
		// Clean up tables before each test
		await sql`DELETE FROM auth_code`;
		await sql`DELETE FROM session`;
		await sql`DELETE FROM employee`;
	});

	describe("generateCode", () => {
		test("should generate a 6-digit numeric code", () => {
			const code = auth.generateCode();

			expect(code).toMatch(/^\d{6}$/);
			expect(code.length).toBe(6);
		});

		test("should generate different codes on multiple calls", () => {
			const code1 = auth.generateCode();
			const code2 = auth.generateCode();
			const code3 = auth.generateCode();

			// While theoretically possible to get duplicates, it's extremely unlikely
			const codes = [code1, code2, code3];
			const uniqueCodes = new Set(codes);
			expect(uniqueCodes.size).toBeGreaterThan(1);
		});
	});

	describe("setCode", () => {
		test("should insert a new auth code for email", async () => {
			const email = "test@example.com";
			const code = "123456";

			await auth.setCode(email, code);
			const returnCode = await auth.getCode(email);

			console.log(returnCode);

			expect(returnCode).toBe(code);
		});

		test("Create a new table, insert a row and retrieve it", async () => {
			const tableName = `temp_test`;

			// Create table
			await sql`CREATE TABLE temp_test (
				id INTEGER PRIMARY KEY,
				name TEXT,
				value INTEGER
			)`;

			// Insert row
			const testName = "test_item";
			const testValue = 42;
			await sql`INSERT INTO temp_test (name, value) VALUES (${testName}, ${testValue})`;

			// Retrieve row
			const result =
				await sql`SELECT * FROM temp_test WHERE name = ${testName}`;

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe(testName);
			expect(result[0].value).toBe(testValue);

			// Clean up
			await sql`DROP TABLE ${sql(tableName)}`;
		});

		test("should replace existing code for same email", async () => {
			const email = "test@example.com";
			const oldCode = "111111";
			const newCode = "222222";

			// Insert first code
			await auth.setCode(email, oldCode);

			// Insert second code (should replace first)
			await auth.setCode(email, newCode);

			const result = await sql`
        SELECT email, code FROM auth_code WHERE email = ${email}
      `;

			expect(result).toHaveLength(1);
			expect(result[0].code).toBe(newCode);
		});

		test("should allow different codes for different emails", async () => {
			const email1 = "user1@example.com";
			const email2 = "user2@example.com";
			const code1 = "111111";
			const code2 = "222222";

			await auth.setCode(email1, code1);
			await auth.setCode(email2, code2);

			const result = await sql`
        SELECT email, code FROM auth_code ORDER BY email
      `;

			expect(result).toHaveLength(2);
			expect(result[0].email).toBe(email1);
			expect(result[0].code).toBe(code1);
			expect(result[1].email).toBe(email2);
			expect(result[1].code).toBe(code2);
		});
	});

	describe("can generate code", () => {
		test("should return true when no code exists for email", async () => {
			const email = "nonexistent@example.com";

			const exists = await auth.canRegenerateCode(email);

			expect(exists).toBe(true);
		});

		test("should return false when recent code exists for email", async () => {
			const email = "test@example.com";
			const code = "123456";

			await auth.setCode(email, code);

			const able = await auth.canRegenerateCode(email);

			expect(able).toBe(false);
		});

		test("should return true when code is older than 5 minutes", async () => {
			const email = "test@example.com";
			const code = "123456";

			// Insert code with old timestamp (2 minutes ago)
			await sql`
        INSERT INTO auth_code (email, code, created_at) 
        VALUES (${email}, ${code}, datetime('now', '-6 minutes'))
      `;

			const able = await auth.canRegenerateCode(email);

			expect(able).toBe(true);
		});

		test("should return true when code is within 5 minutes", async () => {
			const email = "test@example.com";
			const code = "123456";

			// Insert code with timestamp 30 seconds ago
			await sql`
        INSERT INTO auth_code (email, code, created_at) 
        VALUES (${email}, ${code}, datetime('now', '-3 minutes'))
      `;

			const able = await auth.canRegenerateCode(email);

			expect(able).toBe(true);
		});

		test("should only check codes for specific email", async () => {
			const email1 = "user1@example.com";
			const email2 = "user2@example.com";
			const code = "123456";

			// Set code for email1 only
			await auth.setCode(email1, code);

			const able1 = await auth.canRegenerateCode(email1);
			const able2 = await auth.canRegenerateCode(email2);

			expect(able1).toBe(false);
			expect(able2).toBe(true);
		});

		test("use code invalidates it", async () => {
			const email = "test@example.com";
			const code = "123456";

			await auth.setCode(email, code);
			const exists = await auth.useCode(email);
			expect(exists).toBe(true);

			const existsAfterUse = await auth.useCode(email);
			expect(existsAfterUse).toBe(false);
		});
	});

	describe("logoutSession", () => {
		test("should successfully logout valid session", async () => {
			const email = "test@example.com";
			const code = "123456";

			const email2 = "test2@example.com";
			const code2 = "654321";

			// Set up user and session through login flow
			await auth.setCode(email, code);
			await auth.setCode(email2, code2);

			const sessionId = await auth.finalizeLogin(email, code);
			const sessionId2 = await auth.finalizeLogin(email2, code2);

			expect(sessionId).not.toBe(false);
			expect(sessionId2).not.toBe(false);
			if (sessionId === false || sessionId2 === false)
				return;

			const user = await auth.getSessionEmployee(sessionId);
			const user2 = await auth.getSessionEmployee(sessionId2);

			expect(user).toBeDefined();
			expect(user2).toBeDefined();

			// Logout
			const result = await auth.logoutEmployee(sessionId);
			expect(result).toBe(true);

			const user1_again = await auth.getSessionEmployee(sessionId);
			const user2_again = await auth.getSessionEmployee(sessionId2);

			expect(user1_again).not.toBeDefined();
			expect(user2_again).toBeDefined();
		});

		test("should return false for non-existent user", async () => {
			const email = "nonexistent@example.com";
			const sessionId = "fake-session-id";

			const result = await auth.logoutEmployee(sessionId);

			expect(result).toBe(false);
		});
	});
});
