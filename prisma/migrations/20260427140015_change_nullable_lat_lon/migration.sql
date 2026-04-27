-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SessionType" ADD VALUE 'test';
ALTER TYPE "SessionType" ADD VALUE 'unknown';

-- AlterTable
ALTER TABLE "circuit" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL,
ALTER COLUMN "lenght" DROP NOT NULL;
