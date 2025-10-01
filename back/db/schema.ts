import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const authCode = sqliteTable("auth_code", {
    id: integer().primaryKey({ autoIncrement: true }),
    email: text().notNull(),
    code: text().notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
});

// Indexes
export const idxAuthCodeEmail = index("idx_auth_code_email").on(authCode.email);
export const idxAuthCodecreated_at = index("idx_auth_code_created_at").on(
    authCode.created_at,
);

export const company = sqliteTable('company', {
    id: integer().primaryKey(),
    name: text().notNull(),
    description: text(),
    icon: text(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text().default(sql`CURRENT_TIMESTAMP`),
});

export const companyRelations = relations(company, ({ many }) => ({
    employees: many(employee),
    customers: many(customer),
    integrations: many(integration),
    invitations: many(invitation),
}));

export const customer = sqliteTable(
    "customer",
    {
        id: integer().primaryKey(),
        company_id: integer()
            .notNull()
            .references(() => company.id),

        platform_id: text().notNull(),
        username: text(),
        platform: text().notNull(),
        lastActivity: text().notNull().default(sql`CURRENT_TIMESTAMP`),
        full_name: text().notNull(),
        platform_channel_id: text(),

        avatar: text(),
        phone: text(),
        country: text(),
        city: text(),
        device: text(),
        ip: text(),
        status: text({ enum: ['online', 'offline', 'idle', 'unknown'] }).notNull().default('unknown'),

        assigned_to: text().references(() => employee.id),
    },
    (t) => [
        uniqueIndex("idx_customers_platform_customer_company").on(
            t.platform,
            t.platform_id,
            t.company_id,
        ),
    ],
);

export const customerRelations = relations(customer, ({ one, many }) => ({
    company: one(company, {
        fields: [customer.company_id],
        references: [company.id],
    }),
    assignedTo: one(employee, {
        fields: [customer.assigned_to],
        references: [employee.id],
    }),
    messages: many(message),
    notes: many(note),
}));

export const employee = sqliteTable("employee", {
    id: text().primaryKey(),
    email: text().notNull().unique(),
    first_name: text(),
    last_name: text(),
    avatar: text(),
    company_id: integer().references(() => company.id, {
        onDelete: "set null",
    }),
    position: text(),
    onboarded: integer({ mode: "boolean" }).default(false),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text().default(sql`CURRENT_TIMESTAMP`),
});

export const employeeRelations = relations(employee, ({ one, many }) => ({
    company: one(company, {
        fields: [employee.company_id],
        references: [company.id],
    }),
    sessions: many(session),
    messages: many(message),
    invitations: many(invitation),
}));

// Indexes
export const idxEmployeeEmail = uniqueIndex("idx_employee_email").on(
    employee.email,
);

export const integration = sqliteTable(
    "integration",
    {
        id: integer().primaryKey(),
        company_id: integer()
            .notNull()
            .references(() => company.id, { onDelete: "cascade" }),
        platform: text({ enum: ["telegram", "zalo", "email", "whatsapp", "wechat", "discord", "chatmesh", "instagram"] }).notNull(),
        /** zalo: app_id   
         *  telegram: api_key
         *  chatmesh: api_key
        */
        key_1: text().notNull(),
        /** zalo: secret_key / app_secret */
        key_2: text(),
        /** zalo: webhook_secret */
        key_3: text(),
        /** zalo: access_token */
        key_4: text(),
        /** zalo: refresh_token */
        key_5: text(),
        /** zalo: timestamp */
        key_6: text(),
        enabled: integer({ mode: "boolean" }).notNull(),
    },
    (t) => [
        uniqueIndex("idx_integration_company_platform").on(t.company_id, t.platform),
    ],
);

export const integrationRelations = relations(integration, ({ one }) => ({
    company: one(company, {
        fields: [integration.company_id],
        references: [company.id],
    }),
}));

export const message = sqliteTable(
    "message",
    {
        id: integer().primaryKey(),
        customer_id: integer()
            .notNull()
            .references(() => customer.id),
        content: text().notNull(),
        company_id: integer().notNull(),
        created_at: text().default(sql`CURRENT_TIMESTAMP`),
        employee_id: text().references(() => employee.id),
    }
);

export const messageRelations = relations(message, ({ one }) => ({
    employee: one(employee, {
        fields: [message.employee_id],
        references: [employee.id],
    }),
    customer: one(customer, {
        fields: [message.customer_id],
        references: [customer.id],
    }),
}));

export const session = sqliteTable("session", {
    id: integer().primaryKey(),
    session_id: text().notNull().unique(),
    employee_id: text()
        .notNull()
        .references(() => employee.id, { onDelete: "cascade" }),
    device_type: text(),
    device_name: text(),
    last_ip: text().notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    expires_at: text().notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
    employee: one(employee, {
        fields: [session.employee_id],
        references: [employee.id],
    }),
}));

// Indexes
export const idxSessionemployee_id = index("idx_session_employee_id").on(
    session.employee_id,
);
export const idxSessionexpires_at = index("idx_session_expires_at").on(
    session.expires_at,
);

export const invitation = sqliteTable("invitation", {
    id: text().primaryKey(), // UUID token for invitation links
    email: text().notNull(),
    company_id: integer().notNull().references(() => company.id, { onDelete: "cascade" }),
    created_by: text().notNull().references(() => employee.id),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    expires_at: text().notNull(), // 7 days from creation
});

export const invitationRelations = relations(invitation, ({ one }) => ({
    company: one(company, {
        fields: [invitation.company_id],
        references: [company.id],
    }),
    creator: one(employee, {
        fields: [invitation.created_by],
        references: [employee.id],
    }),
}));

// Indexes for invitation table
export const idxInvitationEmail = index("idx_invitation_email").on(invitation.email);
export const idxInvitationCompany = index("idx_invitation_company").on(invitation.company_id);
export const idxInvitationExpires = index("idx_invitation_expires").on(invitation.expires_at);

export const note = sqliteTable("note", {
    id: integer().primaryKey(),
    customer_id: integer()
        .notNull()
        .references(() => customer.id, { onDelete: "cascade" }),
    text: text().notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
    updated_at: text().default(sql`CURRENT_TIMESTAMP`),
});

export const noteRelations = relations(note, ({ one, many }) => ({
    customer: one(customer, {
        fields: [note.customer_id],
        references: [customer.id],
    }),
    updates: many(noteUpdate),
}));

export const noteUpdate = sqliteTable("note_update", {
    id: integer().primaryKey(),
    note_id: integer()
        .notNull()
        .references(() => note.id, { onDelete: "cascade" }),
    employee_id: text()
        .notNull()
        .references(() => employee.id),
    action: text({ enum: ["created", "updated"] }).notNull(),
    created_at: text().default(sql`CURRENT_TIMESTAMP`),
});

export const noteUpdateRelations = relations(noteUpdate, ({ one }) => ({
    note: one(note, {
        fields: [noteUpdate.note_id],
        references: [note.id],
    }),
    employee: one(employee, {
        fields: [noteUpdate.employee_id],
        references: [employee.id],
    }),
}));

// Indexes for notes
export const idxNoteCustomer = index("idx_note_customer").on(note.customer_id);
export const idxNoteUpdateNote = index("idx_note_update_note").on(noteUpdate.note_id);
export const idxNoteUpdateEmployee = index("idx_note_update_employee").on(noteUpdate.employee_id);

