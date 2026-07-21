CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1000),
	"url" varchar(500) NOT NULL,
	"thumbnail_url" varchar(500),
	"category" varchar(50) NOT NULL,
	"is_live" boolean DEFAULT false NOT NULL,
	"views" varchar(50) DEFAULT '0',
	"duration" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
