/*
  Warnings:

  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `method` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'KHALTI');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
ADD COLUMN     "method" "PaymentMethod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "transactionReference" DROP NOT NULL,
ALTER COLUMN "paidAt" DROP NOT NULL;
