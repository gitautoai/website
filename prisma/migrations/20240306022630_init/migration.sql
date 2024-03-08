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
CREATE TABLE "repo_info" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installation_id" BIGINT NOT NULL,
    "login" TEXT NOT NULL,
    "html_url" TEXT,
    "deleted_at" TIMESTAMPTZ(6),
    "repositories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "repository_ids" BIGINT[] DEFAULT ARRAY[]::BIGINT[],
    "requests" BIGINT NOT NULL DEFAULT 0,
    "invoice_id" TEXT,

    CONSTRAINT "repo_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "run_id" BIGINT,
    "used_within_time_period" BIGINT,
    "installation_id" BIGINT NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_installation_id_relationship" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "installation_id" BIGINT NOT NULL,

    CONSTRAINT "owner_installation_id_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "installation_history_installation_target_id_installation_ta_key" ON "installation_history"("installation_target_id", "installation_target_type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "repo_info_installation_id_key" ON "repo_info"("installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "repo_info_login_key" ON "repo_info"("login");

-- CreateIndex
CREATE UNIQUE INDEX "owner_installation_id_relationship_owner_key" ON "owner_installation_id_relationship"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "owner_installation_id_relationship_installation_id_key" ON "owner_installation_id_relationship"("installation_id");

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "public_issues_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "owner_installation_id_relationship"("installation_id") ON DELETE CASCADE ON UPDATE CASCADE;
