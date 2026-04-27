-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('practice', 'qualifying', 'race', 'warmup', 'rally');

-- CreateEnum
CREATE TYPE "SeriesCategory" AS ENUM ('circuit', 'rally', 'moto');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('active', 'inactive', 'unknown');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('scheduled', 'cancelled', 'postponed', 'completed', 'tbc', 'ongoing');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('upcoming', 'cancelled', 'postponed', 'completed');

-- CreateTable
CREATE TABLE "series" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SeriesCategory" NOT NULL,
    "color_hex" TEXT,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "id" BIGSERIAL NOT NULL,
    "series_id" BIGINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "status" "SeasonStatus" NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circuit" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,
    "lenght" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" BIGSERIAL NOT NULL,
    "season_id" BIGINT NOT NULL,
    "circuit_id" BIGINT NOT NULL,
    "round_number" SMALLINT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL,
    "image" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BIGSERIAL NOT NULL,
    "event_id" BIGINT NOT NULL,
    "type" "SessionType" NOT NULL,
    "label" TEXT NOT NULL,
    "scheduled_at" TIMESTAMPTZ NOT NULL,
    "duration" SMALLINT NOT NULL,
    "status" "SessionStatus" NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "series_slug_key" ON "series"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "circuit_name_key" ON "circuit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");

-- AddForeignKey
ALTER TABLE "season" ADD CONSTRAINT "season_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_circuit_id_fkey" FOREIGN KEY ("circuit_id") REFERENCES "circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
