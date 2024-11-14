
> spot@1.0.0 npx
> prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "api";

-- CreateEnum
CREATE TYPE "api"."Status" AS ENUM ('active', 'expired');

-- CreateEnum
CREATE TYPE "api"."UserRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "api"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "daily_cap" BIGINT NOT NULL DEFAULT 100000,
    "last_cap_reset" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roles" "api"."UserRole"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "data_in" BIGINT NOT NULL DEFAULT 0,
    "data_out" BIGINT NOT NULL DEFAULT 0,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "ip_address" TEXT NOT NULL,
    "mac_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "api"."Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "api"."users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "api"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "api"."sessions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_id_key" ON "api"."locations"("id");

-- AddForeignKey
ALTER TABLE "api"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "api"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."sessions" ADD CONSTRAINT "sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "api"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

