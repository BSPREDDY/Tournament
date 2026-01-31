CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "form_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fields" varchar(2000) DEFAULT '[]' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"team_name" varchar(255) NOT NULL,
	"igl_name" varchar(255) NOT NULL,
	"player_1" varchar(255) NOT NULL,
	"player_id_1" varchar(100) NOT NULL,
	"player_2" varchar(255) NOT NULL,
	"player_id_2" varchar(100) NOT NULL,
	"player_3" varchar(255) NOT NULL,
	"player_id_3" varchar(100) NOT NULL,
	"player_4" varchar(255) NOT NULL,
	"player_id_4" varchar(100) NOT NULL,
	"igl_mail" varchar(255) NOT NULL,
	"igl_alternate_mail" varchar(255) NOT NULL,
	"igl_number" varchar(15) NOT NULL,
	"igl_alternate_number" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"age" integer NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "form_data" ADD CONSTRAINT "form_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "form_data_user_unique" ON "form_data" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "form_data_igl_mail_unique" ON "form_data" USING btree ("igl_mail");--> statement-breakpoint
CREATE UNIQUE INDEX "form_data_igl_alt_mail_unique" ON "form_data" USING btree ("igl_alternate_mail");--> statement-breakpoint
CREATE UNIQUE INDEX "form_data_igl_number_unique" ON "form_data" USING btree ("igl_number");--> statement-breakpoint
CREATE UNIQUE INDEX "form_data_igl_alt_number_unique" ON "form_data" USING btree ("igl_alternate_number");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_unique" ON "users" USING btree ("phone_number");