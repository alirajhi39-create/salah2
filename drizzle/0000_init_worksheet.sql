CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_name" text NOT NULL,
	"student_class" text DEFAULT '' NOT NULL,
	"answers" jsonb NOT NULL,
	"auto_score" integer DEFAULT 0 NOT NULL,
	"auto_total" integer DEFAULT 0 NOT NULL,
	"manual_score" integer,
	"manual_total" integer DEFAULT 0 NOT NULL,
	"feedback" text DEFAULT '' NOT NULL,
	"reviewed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
