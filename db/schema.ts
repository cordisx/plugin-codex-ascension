import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ledgerState = sqliteTable("ledger_state", {
  id: integer("id").primaryKey(),
  currentRound: integer("current_round").notNull().default(1),
  currentCount: integer("current_count").notNull().default(0),
  startedAt: text("started_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const petitionDays = sqliteTable("petition_days", {
  day: text("day").primaryKey(),
  count: integer("count").notNull().default(0),
});

export const resetEvents = sqliteTable("reset_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  round: integer("round").notNull().unique(),
  resetAt: text("reset_at").notNull(),
  petitionCount: integer("petition_count").notNull(),
}, (table) => [index("idx_reset_events_reset_at").on(table.resetAt)]);
