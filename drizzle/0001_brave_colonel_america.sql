CREATE TABLE "form_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "form_status_form_id_unique" UNIQUE("form_id")
);
--> statement-breakpoint
ALTER TABLE "form_status" ADD CONSTRAINT "form_status_form_id_form_data_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form_data"("id") ON DELETE cascade ON UPDATE no action;