-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_circuit_id_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_season_id_fkey";

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "season_id" DROP NOT NULL,
ALTER COLUMN "circuit_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_circuit_id_fkey" FOREIGN KEY ("circuit_id") REFERENCES "circuit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
