DROP INDEX "form_data_igl_alt_mail_unique";--> statement-breakpoint
DROP INDEX "form_data_igl_alt_number_unique";--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "player_3" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "player_id_3" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "player_4" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "player_id_4" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "igl_alternate_mail" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_data" ALTER COLUMN "igl_alternate_number" DROP NOT NULL;