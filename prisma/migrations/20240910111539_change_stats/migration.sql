/*
  Warnings:

  - You are about to drop the column `dex` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `int` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `luk` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `str` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `dex` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `int` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `luk` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `str` on the `Item` table. All the data in the column will be lost.
  - Added the required column `stats` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Character` DROP COLUMN `dex`,
    DROP COLUMN `int`,
    DROP COLUMN `luk`,
    DROP COLUMN `str`,
    ADD COLUMN `health` INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN `strength` INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE `EquippedItem` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `dex`,
    DROP COLUMN `int`,
    DROP COLUMN `luk`,
    DROP COLUMN `str`,
    ADD COLUMN `stats` JSON NOT NULL;
