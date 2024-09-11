import { prisma } from '../utils/prisma/index.js';

// 아이템 구매
export const purchaseItemForCharacter = async (characterId, itemId, quantity) => {
  const character = await prisma.character.findUnique({ where: { characterId } });
  const item = await prisma.item.findUnique({ where: { itemId } });

  const totalCost = item.price * quantity;
  if (character.money < totalCost) throw new Error('돈이 부족합니다.');

  await prisma.inventory.create({
    data: { characterId, itemId, quantity },
  });

  return prisma.character.update({
    where: { characterId },
    data: { money: character.money - totalCost },
  });
};

// 아이템 판매
export const sellItemFromCharacter = async (characterId, itemId, quantity) => {
  const inventoryItem = await prisma.inventory.findFirst({
    where: { characterId, itemId },
  });

  const item = await prisma.item.findUnique({ where: { itemId } });
  const salePrice = Math.floor(item.price * 0.6 * quantity);

  await prisma.inventory.update({
    where: { inventoryId: inventoryItem.inventoryId },
    data: { quantity: inventoryItem.quantity - quantity },
  });

  return prisma.character.update({
    where: { characterId },
    data: { money: { increment: salePrice } },
  });
};

// 아이템 장착
export const equipItemToCharacter = async (characterId, itemId) => {
  const character = await prisma.character.findUnique({ where: { characterId } });
  const item = await prisma.item.findUnique({ where: { itemId } });

  await prisma.equippedItems.create({
    data: { characterId, itemId },
  });

  return prisma.character.update({
    where: { characterId },
    data: {
      health: character.health + item.stats.health,
      strength: character.strength + item.stats.strength,
    },
  });
};

// 아이템 탈착
export const unequipItemFromCharacter = async (characterId, itemId) => {
  const character = await prisma.character.findUnique({ where: { characterId } });
  const item = await prisma.item.findUnique({ where: { itemId } });

  await prisma.equippedItems.deleteMany({
    where: { characterId, itemId },
  });

  return prisma.character.update({
    where: { characterId },
    data: {
      health: character.health - item.stats.health,
      strength: character.strength - item.stats.strength,
    },
  });
};
