import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test,
} from "bun:test";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import {
	authCode,
	company,
	employee,
	invitation,
	session,
} from "../../db/schema";
import useAuth from "../auth.js";
import useInvitation from "../invitation.js";

describe("useAuth", () => {
	let originalDatabaseUrl: string | undefined;
	let auth: ReturnType<typeof useAuth>;

	beforeAll(async () => {
		console.log(process.env.NODE_ENV);
		process.env.DATABASE_URL = ":memory:";
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
		await db.delete(invitation);
		await db.delete(session);
		await db.delete(employee);
		await db.delete(company);
		await db.delete(authCode);
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

		test("should replace existing code for same email", async () => {
			const testEmail = "test@example.com";
			const oldCode = "111111";
			const newCode = "222222";

			// Insert first code
			await auth.setCode(testEmail, oldCode);

			// Insert second code (should replace first)
			await auth.setCode(testEmail, newCode);

			const result = await db
				.select({ email: authCode.email, code: authCode.code })
				.from(authCode)
				.where(eq(authCode.email, testEmail));

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

			const result = await db
				.select({ email: authCode.email, code: authCode.code })
				.from(authCode)
				.orderBy(authCode.email);

			expect(result).toHaveLength(2);
			expect(result[0]!.email).toBe(email1);
			expect(result[0]!.code).toBe(code1);
			expect(result[1]!.email).toBe(email2);
			expect(result[1]!.code).toBe(code2);
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
			const testEmail = "test@example.com";
			const code = "123456";

			// Insert code with old timestamp (6 minutes ago)
			await db.insert(authCode).values({
				email: testEmail,
				code,
				created_at: sql`datetime('now', '-6 minutes')`,
			});

			const able = await auth.canRegenerateCode(testEmail);

			expect(able).toBe(true);
		});

		test("should return true when code is within 5 minutes", async () => {
			const testEmail = "test@example.com";
			const code = "123456";

			// Insert code with timestamp 3 minutes ago
			await db.insert(authCode).values({
				email: testEmail,
				code,
				created_at: sql`datetime('now', '-3 minutes')`,
			});

			const able = await auth.canRegenerateCode(testEmail);

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
			if (sessionId === false || sessionId2 === false) return;

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

	describe("loginWithInvitation", () => {
		test("should successfully login with valid invitation for new user", async () => {
			const email = "invited@example.com";
			const invitationService = useInvitation();

			// Create a company first
			const [companyResult] = await db
				.insert(company)
				.values({
					name: "Test Company",
					description: "Test Description"
				})
				.returning({ id: company.id });

			// Create an inviter employee
			const [inviterResult] = await db
				.insert(employee)
				.values({
					email: "inviter@example.com",
					company_id: companyResult.id
				})
				.returning({ id: employee.id });

			// Create invitation
			const invitationId = await invitationService.createInvitation(
				email,
				companyResult.id,
				inviterResult.id
			);

			// Login with invitation
			const sessionId = await auth.loginWithInvitation(invitationId);

			expect(sessionId).not.toBeNull();
			expect(typeof sessionId).toBe("string");

			// Verify session was created
			const user = await auth.getSessionEmployee(sessionId!);
			expect(user).toBeDefined();
			expect(user!.email).toBe(email);
		});

		test("should successfully login with valid invitation for existing user", async () => {
			const email = "existing@example.com";
			const invitationService = useInvitation();

			// Create a company first
			const [companyResult] = await db
				.insert(company)
				.values({
					name: "Test Company",
					description: "Test Description"
				})
				.returning({ id: company.id });

			// Create an inviter employee
			const [inviterResult] = await db
				.insert(employee)
				.values({
					email: "inviter@example.com",
					company_id: companyResult.id
				})
				.returning({ id: employee.id });

			// Create existing user without company
			await db
				.insert(employee)
				.values({
					email: email,
					company_id: null
				});

			// Create invitation
			const invitationId = await invitationService.createInvitation(
				email,
				companyResult.id,
				inviterResult.id
			);

			// Login with invitation
			const sessionId = await auth.loginWithInvitation(invitationId);

			expect(sessionId).not.toBeNull();
			expect(typeof sessionId).toBe("string");

			// Verify session was created
			const user = await auth.getSessionEmployee(sessionId!);
			expect(user).toBeDefined();
			expect(user!.email).toBe(email);
		});

		test("should return null for invalid invitation token", async () => {
			const invalidToken = "invalid-token-123";

			const sessionId = await auth.loginWithInvitation(invalidToken);

			expect(sessionId).toBeNull();
		});

		test("should return null for expired invitation", async () => {
			const email = "expired@example.com";
			const invitationService = useInvitation();

			// Create a company first
			const [companyResult] = await db
				.insert(company)
				.values({
					name: "Test Company",
					description: "Test Description"
				})
				.returning({ id: company.id });

			// Create an inviter employee
			const [inviterResult] = await db
				.insert(employee)
				.values({
					email: "inviter@example.com",
					company_id: companyResult.id
				})
				.returning({ id: employee.id });

			// Create expired invitation manually
			const invitationId = crypto.randomUUID();
			const expiredDate = new Date();
			expiredDate.setDate(expiredDate.getDate() - 1); // Yesterday

			await db.insert(invitation).values({
				id: invitationId,
				email: email,
				company_id: companyResult.id,
				created_by: inviterResult.id,
				expires_at: expiredDate.toISOString()
			});

			// Try to login with expired invitation
			const sessionId = await auth.loginWithInvitation(invitationId);

			expect(sessionId).toBeNull();
		});

		test("should return null for user who already has a company", async () => {
			const email = "hascompany@example.com";
			const invitationService = useInvitation();

			// Create companies
			const [company1Result] = await db
				.insert(company)
				.values({
					name: "Company 1",
					description: "First Company"
				})
				.returning({ id: company.id });

			const [company2Result] = await db
				.insert(company)
				.values({
					name: "Company 2", 
					description: "Second Company"
				})
				.returning({ id: company.id });

			// Create user with existing company
			await db
				.insert(employee)
				.values({
					email: email,
					company_id: company1Result.id
				});

			// Create an inviter employee for second company
			const [inviterResult] = await db
				.insert(employee)
				.values({
					email: "inviter@example.com",
					company_id: company2Result.id
				})
				.returning({ id: employee.id });

			// Create invitation (this should fail in real scenario, but let's test the login part)
			const invitationId = crypto.randomUUID();
			await db.insert(invitation).values({
				id: invitationId,
				email: email,
				company_id: company2Result.id,
				created_by: inviterResult.id,
				expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
			});

			// Try to login with invitation
			const sessionId = await auth.loginWithInvitation(invitationId);

			expect(sessionId).toBeNull();
		});

		test("should delete existing sessions when logging in with invitation", async () => {
			const email = "multisession@example.com";
			const invitationService = useInvitation();

			// Create a company first
			const [companyResult] = await db
				.insert(company)
				.values({
					name: "Test Company",
					description: "Test Description"
				})
				.returning({ id: company.id });

			// Create an inviter employee
			const [inviterResult] = await db
				.insert(employee)
				.values({
					email: "inviter@example.com",
					company_id: companyResult.id
				})
				.returning({ id: employee.id });

			// Create user
			const [userResult] = await db
				.insert(employee)
				.values({
					email: email,
					company_id: null
				})
				.returning({ id: employee.id });

			// Create existing session
			const oldSessionId = crypto.randomUUID();
			await db.insert(session).values({
				id: oldSessionId,
				employee_id: userResult.id,
				expires_at: sql`datetime('now', '+30 days')`
			});

			// Create invitation
			const invitationId = await invitationService.createInvitation(
				email,
				companyResult.id,
				inviterResult.id
			);

			// Login with invitation
			const newSessionId = await auth.loginWithInvitation(invitationId);

			expect(newSessionId).not.toBeNull();
			expect(newSessionId).not.toBe(oldSessionId);

			// Verify old session is deleted
			const oldUser = await auth.getSessionEmployee(oldSessionId);
			expect(oldUser).toBeUndefined();

			// Verify new session works
			const newUser = await auth.getSessionEmployee(newSessionId!);
			expect(newUser).toBeDefined();
			expect(newUser!.email).toBe(email);
		});
	});
});
