/*
  Warnings:

  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Made the column `mac_address` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ip_address` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "api"."sessions" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_in" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "data_out" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "mac_address" SET NOT NULL,
ALTER COLUMN "mac_address" SET DATA TYPE TEXT,
ALTER COLUMN "ip_address" SET NOT NULL,
ALTER COLUMN "ip_address" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "api"."users" DROP COLUMN "updated_at",
ADD COLUMN     "daily_cap" BIGINT NOT NULL DEFAULT 100000,
ADD COLUMN     "last_cap_reset" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "api"."locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_key" ON "api"."locations"("id");

-- AddForeignKey
ALTER TABLE "api"."sessions" ADD CONSTRAINT "sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
