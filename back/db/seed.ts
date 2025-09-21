import { sql } from "drizzle-orm";
import { db } from "./db"; // your Drizzle instance
import {
	company,
	customer,
	employee,
	integration,
	message,
	session,
} from "./schema";

export const seedDb = async () => {
	// Check if employees exist
	const employeeCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(employee)
		.then((res) => res[0]?.count ?? 0);

	if (employeeCount > 0) {
		console.log("Database already seeded, skipping...");
		return;
	}

	console.log("🌱 Seeding database...");

	// Insert company
	await db.insert(company).values({
		id: 1,
		name: "Mountain Llamas",
		description:
			"Insane company you wouldnt believe it. The world hasnt seen a company like this one",
		icon: "",
	});

	// Insert employee
	await db.insert(employee).values({
		id: "1",
		first_name: "Just",
		last_name: "Andou",
		email: "justvibesfyi@gmail.com",
		onboarded: true,
		company_id: 1,
		avatar: "https://i.pravatar.cc/150?u=129",

	});

	// Insert session
	await db.insert(session).values({
		id: "1",
		employee_id: "1",
		expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
	});

	// Insert customers
	await db.insert(customer).values([
		{
			id: 1,
			company_id: 1,
			name: "Jane",
			platform: "telegram",
			platform_customer_id: "123",
			platform_channel_id: "123",
			avatar: "https://i.pravatar.cc/150?u=125",
		},
		{
			id: 2,
			company_id: 1,
			name: "Joe",
			platform: "telegram",
			platform_customer_id: "456",
			platform_channel_id: "456",
			avatar: "https://i.pravatar.cc/150?u=456",
		}
	]);

	// Insert messages
	await db.insert(message)
		.values([{
			id: 1,
			content: "Hi there! I need some help with my order.",
			company_id: 1,
			employee_id: null,
			customer_id: 1,
			created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		},
		{
			id: 2,
			content: "Hello, How may i help you?",
			company_id: 1,
			employee_id: "1",
			customer_id: 1,
			created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
		},
		{
			id: 5,
			content: "No question!! Just help!!",
			company_id: 1,
			employee_id: null,
			customer_id: 1,
			created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
		},
		{
			id: 3,
			content: "Yo whats up.",
			company_id: 1,
			employee_id: null,
			customer_id: 2,
			created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
		},
		{
			id: 4,
			content: "Don't talk to me like that!",
			company_id: 1,
			employee_id: "1",
			customer_id: 2,
			created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // -1 minute
		}
		]);

	// Insert integration
	await db.insert(integration).values({
		id: 1,
		company_id: 1,
		platform: "telegram",
		key_1: "6754974318:AAFjhSFtScQ91ZlsY10JB8F_jIg02L75Yb0",
		enabled: true,
	});

	console.log("✅ Database successfully seeded!");
};
