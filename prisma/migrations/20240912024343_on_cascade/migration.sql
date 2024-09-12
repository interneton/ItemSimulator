-- DropForeignKey
ALTER TABLE `Character` DROP FOREIGN KEY `Character_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `EquippedItem` DROP FOREIGN KEY `EquippedItem_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `EquippedItem` DROP FOREIGN KEY `EquippedItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_itemId_fkey`;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`accountId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquippedItem` ADD CONSTRAINT `EquippedItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`characterId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquippedItem` ADD CONSTRAINT `EquippedItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`itemId`) ON DELETE CASCADE ON UPDATE CASCADE;
