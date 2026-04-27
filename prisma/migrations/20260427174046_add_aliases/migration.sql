-- CreateTable
CREATE TABLE "circuit_alias" (
    "id" BIGSERIAL NOT NULL,
    "circuit_id" BIGINT NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "circuit_alias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "circuit_alias_alias_key" ON "circuit_alias"("alias");

-- AddForeignKey
ALTER TABLE "circuit_alias" ADD CONSTRAINT "circuit_alias_circuit_id_fkey" FOREIGN KEY ("circuit_id") REFERENCES "circuit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
