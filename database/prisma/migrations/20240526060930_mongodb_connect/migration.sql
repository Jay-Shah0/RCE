/*
  Warnings:

  - You are about to drop the column `mongoUserId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "mongoUserId",
ADD COLUMN     "mongouserid" TEXT;
