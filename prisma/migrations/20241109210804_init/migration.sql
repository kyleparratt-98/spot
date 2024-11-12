-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "api";

-- CreateEnum
CREATE TYPE "api"."Status" AS ENUM ('active', 'expired');

-- CreateTable
CREATE TABLE "api"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "mac_address" VARCHAR(17),
    "ip_address" INET,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "status" "api"."Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "api"."users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "api"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "api"."sessions"("id");

-- AddForeignKey
ALTER TABLE "api"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "api"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
