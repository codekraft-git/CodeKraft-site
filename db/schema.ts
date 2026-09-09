import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const contactSubmissions = sqliteTable("contact_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull().default(""),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at").notNull(),
});

export const contactRateLimits = sqliteTable("contact_rate_limits", {
  key: text("key").primaryKey(),
  windowStart: integer("window_start").notNull(),
  count: integer("count").notNull().default(1),
}, table => [index("idx_contact_rate_limits_window_start").on(table.windowStart)]);
