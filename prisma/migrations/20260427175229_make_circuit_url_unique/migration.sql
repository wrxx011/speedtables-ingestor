/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `circuit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "circuit_url_key" ON "circuit"("url");
