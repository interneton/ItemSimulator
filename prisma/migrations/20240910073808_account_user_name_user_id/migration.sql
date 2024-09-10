/*
  Warnings:

  - You are about to drop the column `username` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Account_username_key` ON `Account`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `username`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Account_userId_key` ON `Account`(`userId`);
