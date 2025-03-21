-- CreateTable
CREATE TABLE "installation_history" (
    "id" SERIAL NOT NULL,
    "installation_target_type" TEXT NOT NULL,
    "installation_target_id" BIGINT NOT NULL,
    "installation_target_name" TEXT NOT NULL,
    "installation_id" BIGINT NOT NULL,
    "installation_status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" BIGINT NOT NULL,
    "created_by_name" TEXT NOT NULL,

    CONSTRAINT "installation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "run_id" BIGINT,
    "used_within_time_period" BIGINT,
    "installation_id" BIGINT NOT NULL,
    "progress" SMALLINT NOT NULL DEFAULT 0,
    "unique_id" TEXT NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_info" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installation_id" BIGINT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "request_count" BIGINT NOT NULL DEFAULT 0,
    "invoice_id" TEXT,
    "completed_request_count" BIGINT DEFAULT 0,

    CONSTRAINT "owner_info_pkey" PRIMARY KEY ("id")
);