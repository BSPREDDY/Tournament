ALTER TABLE "registration_config" ADD COLUMN "max_matches" varchar(10) DEFAULT '999' NOT NULL;--> statement-breakpoint
ALTER TABLE "registration_config" DROP COLUMN "max_teams";