CREATE TABLE "match_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"form_data_id" uuid NOT NULL,
	"team_slot" varchar(10) NOT NULL,
	"status" varchar(50) DEFAULT 'registered' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_number" varchar(50) NOT NULL,
	"room_id" varchar(255) NOT NULL,
	"room_password" varchar(255) NOT NULL,
	"max_teams" varchar(10) DEFAULT '25' NOT NULL,
	"registered_teams" varchar(10) DEFAULT '0' NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"password_share_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "matches_room_id_unique" UNIQUE("room_id")
);
--> statement-breakpoint
ALTER TABLE "match_teams" ADD CONSTRAINT "match_teams_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_teams" ADD CONSTRAINT "match_teams_form_data_id_form_data_id_fk" FOREIGN KEY ("form_data_id") REFERENCES "public"."form_data"("id") ON DELETE cascade ON UPDATE no action;