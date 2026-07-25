CREATE TABLE "coding_problems" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"topic" text NOT NULL,
	"is_pyq" boolean DEFAULT true NOT NULL,
	"statement" text NOT NULL,
	"constraints" text NOT NULL,
	"input_format" text NOT NULL,
	"output_format" text NOT NULL,
	"sample_input" text NOT NULL,
	"sample_output" text NOT NULL,
	"sample_explanation" text,
	"solutions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"common_mistakes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"similar_problems" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pro_tip" text,
	"exam" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coding_problems_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"total_units" integer DEFAULT 12 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "jee_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam" text NOT NULL,
	"subject" text NOT NULL,
	"chapter" text NOT NULL,
	"number" text NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text,
	"year" integer,
	"is_pyq" boolean DEFAULT true NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"section" text NOT NULL,
	"number" text NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"topic" text NOT NULL,
	"time_seconds" integer DEFAULT 40 NOT NULL,
	"is_pyq" boolean DEFAULT true NOT NULL,
	"year" integer,
	"question_text" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"question_type" text DEFAULT 'mcq' NOT NULL,
	"correct_indices" jsonb,
	"numerical_answer" double precision,
	"numerical_tolerance" double precision,
	"numerical_unit" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programming_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"title" text NOT NULL,
	"difficulty" text DEFAULT 'Easy' NOT NULL,
	"topic" text NOT NULL,
	"language" text DEFAULT 'C' NOT NULL,
	"time_seconds" integer DEFAULT 40 NOT NULL,
	"is_pyq" boolean DEFAULT true NOT NULL,
	"year" integer,
	"question_text" text NOT NULL,
	"code_snippet" text,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"year" integer NOT NULL,
	"unit" integer NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_index" integer NOT NULL,
	"explanation" text,
	"question_type" text DEFAULT 'mcq' NOT NULL,
	"correct_indices" jsonb,
	"numerical_answer" double precision,
	"numerical_tolerance" double precision,
	"numerical_unit" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "coding_topic_idx" ON "coding_problems" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "coding_diff_idx" ON "coding_problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "coding_exam_idx" ON "coding_problems" USING btree ("exam");--> statement-breakpoint
CREATE INDEX "jee_exam_sub_ch_idx" ON "jee_questions" USING btree ("exam","subject","chapter");--> statement-breakpoint
CREATE INDEX "jee_exam_idx" ON "jee_questions" USING btree ("exam");--> statement-breakpoint
CREATE INDEX "practice_cat_sec_idx" ON "practice_questions" USING btree ("category","section");--> statement-breakpoint
CREATE INDEX "practice_topic_idx" ON "practice_questions" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "practice_diff_idx" ON "practice_questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "prog_q_topic_idx" ON "programming_questions" USING btree ("topic");--> statement-breakpoint
CREATE INDEX "prog_q_diff_idx" ON "programming_questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "questions_course_year_idx" ON "questions" USING btree ("course_id","year");--> statement-breakpoint
CREATE INDEX "questions_course_unit_idx" ON "questions" USING btree ("course_id","unit");