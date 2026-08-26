CREATE TABLE `ledger_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`current_round` integer DEFAULT 1 NOT NULL,
	`current_count` integer DEFAULT 0 NOT NULL,
	`started_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `petition_days` (
	`day` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reset_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`round` integer NOT NULL,
	`reset_at` text NOT NULL,
	`petition_count` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reset_events_round_unique` ON `reset_events` (`round`);--> statement-breakpoint
CREATE INDEX `idx_reset_events_reset_at` ON `reset_events` (`reset_at`);