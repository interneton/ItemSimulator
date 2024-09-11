/*
  Warnings:

  - You are about to drop the column `equippedAt` on the `EquippedItem` table. All the data in the column will be lost.
  - You are about to drop the column `requiredLevel` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EquippedItem` DROP COLUMN `equippedAt`;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `requiredLevel`,
    DROP COLUMN `type`;
