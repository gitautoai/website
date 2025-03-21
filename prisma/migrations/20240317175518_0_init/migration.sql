/*
  Warnings:

  - A unique constraint covering the columns `[installation_target_id,installation_target_type,created_at]` on the table `installation_history` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[unique_id]` on the table `issues` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[installation_id]` on the table `owner_info` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_name]` on the table `owner_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "installation_history_installation_target_id_installation_ta_key" ON "installation_history"("installation_target_id", "installation_target_type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "issues_issue_key" ON "issues"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "owner_info_installation_id_key" ON "owner_info"("installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "owner_info_owner_name_key" ON "owner_info"("owner_name");

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "public_issues_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "owner_info"("installation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
