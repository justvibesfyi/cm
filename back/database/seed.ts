import { sql } from "bun";

export const seedDb = async () => {
	const res = await sql`SELECT COUNT(*) as c FROM employee`.then(res => res[0]);
	if (res.c > 0) return;

	console.log("seeding data")
	// insert company, user
	await sql`
		INSERT INTO company (id, name, description, icon) VALUES (1, 'Mountain Llamas', 'Insane company you wouldnt believe it. The world hasnt seen a company like this one', '')
	`

	await sql`
		INSERT INTO employee (id, first_name, last_name, email, onboarded, company_id, avatar) VALUES ("1", 'Just', 'Andou', 'justvibesfyi@gmail.com', 1, 1, 'https://i.pravatar.cc/150?u=129')
	`

	await sql`
		INSERT INTO session (id, employee_id, expires_at) VALUES ("1", "1", datetime('now', '+100 years'))
	`

	await sql`
		INSERT INTO customer (id, company_id, name, platform, customer_id, platform_channel_id, avatar) VALUES (1, 1, 'Jane', 'telegram', '123', '123', 'https://i.pravatar.cc/150?u=125');
		INSERT INTO customer (id, company_id, name, platform, customer_id, platform_channel_id, avatar) VALUES (2, 1, 'Joe', 'telegram', '456', '456', 'https://i.pravatar.cc/150?u=456');
	`

	await sql`
		INSERT INTO message(id, content, company_id, employee_id, customer_id, created_at) VALUES (1, 'Hi there! I need some help with my order.', 1, NULL, 1, datetime('now', '-5 minutes'));
		INSERT INTO message(id, content, company_id, employee_id, customer_id, created_at) VALUES (2, 'Hello, How may i help you?', 1, "1", 1, datetime('now', '-3 minutes'));
		INSERT INTO message(id, content, company_id, employee_id, customer_id, created_at) VALUES (5, 'No question!! Just help!!', 1, NULL, 1, datetime('now', '-3 minutes'));

		INSERT INTO message(id, content, company_id, employee_id, customer_id, created_at) VALUES (3, 'Yo whats up.', 1, NULL, 2, datetime('now', '-2 minutes'));
		INSERT INTO message(id, content, company_id, employee_id, customer_id, created_at) VALUES (4, "Don't talk to me like that!", 1, "1", 2, datetime('now', '-1 minutes'));
	`

	await sql`
		INSERT INTO integration(id, company_id, platform, api_key, enabled) VALUES (1, 1, 'telegram', '6754974318:AAFjhSFtScQ91ZlsY10JB8F_jIg02L75Yb0', 1);
	`
};