import { prisma } from '../utils/prisma/index.js';

// 아이템 구매
export const purchaseItemForCharacter = async (characterId, itemId, quantity, accountId) => {
  const character = await prisma.character.findUnique({ where: { characterId } });
  if (!character || character.accountId !== accountId) {
    return { error: '해당 캐릭터가 존재하지 않거나 계정에 속하지 않습니다.', statusCode: 403 };
  }

  const item = await prisma.item.findUnique({ where: { itemId } });
  if (!item) {
    return { error: '존재하지 않는 아이템입니다.', statusCode: 404 };
  }

  const totalCost = item.price * quantity;
  if (character.money < totalCost) {
    return { error: '돈이 부족합니다.', statusCode: 400 };
  }

  // Check if the item already exists in the character's inventory
  const existingInventoryItem = await prisma.inventory.findFirst({
    where: { characterId, itemId },
  });

  if (existingInventoryItem) {
    // If the item exists, increment the quantity
    await prisma.inventory.update({
      where: { inventoryId: existingInventoryItem.inventoryId },
      data: { quantity: { increment: quantity } },
    });
  } else {
    // If the item doesn't exist, add a new entry to the inventory
    await prisma.inventory.create({
      data: { characterId, itemId, quantity },
    });
  }

  // Update the character's money
  const updatedCharacter = await prisma.character.update({
    where: { characterId },
    data: { money: character.money - totalCost },
  });

  return { data: updatedCharacter, statusCode: 200 };
};

// 아이템 판매
export const sellItemFromCharacter = async (characterId, itemId, quantity, accountId) => {
  const character = await prisma.character.findUnique({ where: { characterId } });
  if (!character || character.accountId !== accountId) {
    return { error: '해당 캐릭터가 존재하지 않거나 계정에 속하지 않습니다.', statusCode: 403 };
  }

  const inventoryItem = await prisma.inventory.findFirst({
    where: { characterId, itemId },
  });
  if (!inventoryItem || inventoryItem.quantity < quantity) {
    return { error: '인벤토리에 해당 아이템이 없거나 개수가 부족합니다.', statusCode: 400 };
  }

  const item = await prisma.item.findUnique({ where: { itemId } });
  const salePrice = Math.floor(item.price * 0.6 * quantity); // 판매는 가격의 60%

  // Update the inventory or delete it if quantity becomes 0
  if (inventoryItem.quantity - quantity === 0) {
    // Delete the inventory item if the quantity becomes 0
    await prisma.inventory.delete({
      where: { inventoryId: inventoryItem.inventoryId },
    });
  } else {
    // Otherwise, decrement the quantity
    await prisma.inventory.update({
      where: { inventoryId: inventoryItem.inventoryId },
      data: { quantity: { decrement: quantity } },
    });
  }

  // Update the character's money
  const updatedCharacter = await prisma.character.update({
    where: { characterId },
    data: { money: { increment: salePrice } },
  });

  return { data: updatedCharacter, statusCode: 200 };
};

// 아이템 장착
export const equipItemToCharacter = async (characterId, itemId, accountId) => {
  // 캐릭터가 내 계정의 것인지 확인
  const character = await prisma.character.findUnique({ where: { characterId } });
  if (!character || character.accountId !== accountId) {
    return { error: '해당 캐릭터가 존재하지 않거나 계정에 속하지 않습니다.', statusCode: 403 };
  }

  // 인벤토리에 해당 아이템이 있는지 확인
  const inventoryItem = await prisma.inventory.findFirst({
    where: { characterId, itemId },
  });

  if (!inventoryItem || inventoryItem.quantity <= 0) {
    return { error: '해당 아이템이 인벤토리에 없습니다.', statusCode: 404 };
  }

  // 동일한 아이템이 이미 장착되어 있는지 확인
  const alreadyEquipped = await prisma.equippedItems.findFirst({
    where: { characterId, itemId },
  });

  if (alreadyEquipped) {
    return { error: '해당 아이템이 이미 장착되어 있습니다.', statusCode: 400 };
  }

  // Proceed with equipping the item
  const item = await prisma.item.findUnique({ where: { itemId } });

  // Default to 0 if stats are missing
  const healthBonus = item.stats?.health || 0;
  const strengthBonus = item.stats?.strength || 0;

  await prisma.equippedItems.create({
    data: { characterId, itemId },
  });

  // Update character stats after equipping the item
  const updatedCharacter = await prisma.character.update({
    where: { characterId },
    data: {
      health: character.health + healthBonus,
      strength: character.strength + strengthBonus,
    },
  });

  return { data: updatedCharacter, statusCode: 200 };
};

// 아이템 탈착
export const unequipItemFromCharacter = async (characterId, itemId, accountId) => {
  // 캐릭터가 내 계정의 것인지 확인
  const character = await prisma.character.findUnique({ where: { characterId } });
  if (!character || character.accountId !== accountId) {
    return { error: '해당 캐릭터가 존재하지 않거나 계정에 속하지 않습니다.', statusCode: 403 };
  }

  // 장착된 아이템이 있는지 확인
  const equippedItem = await prisma.equippedItem.findFirst({
    where: { characterId, itemId },
  });

  if (!equippedItem) {
    return { error: '해당 아이템이 장착되어 있지 않습니다.', statusCode: 404 };
  }

  // Proceed with unequipping the item
  const item = await prisma.item.findUnique({ where: { itemId } });

  const healthBonus = item.stats?.health || 0;
  const strengthBonus = item.stats?.strength || 0;

  await prisma.equippedItem.deleteMany({
    where: { characterId, itemId },
  });

  // Update character stats after unequipping the item
  const updatedCharacter = await prisma.character.update({
    where: { characterId },
    data: {
      health: character.health - healthBonus,
      strength: character.strength - strengthBonus,
    },
  });

  return { data: updatedCharacter, statusCode: 200 };
};

// 모든 아이템 조회
export const findAllItems = async () => {
  return await prisma.item.findMany({
    select: {
      itemId: true,
      name: true,
      price: true,
    },
  });
};

// 특정 아이템 조회
export const findItemById = async (itemId) => {
  return await prisma.item.findUnique({
    where: { itemId: parseInt(itemId, 10) },
    select: {
      itemId: true,
      name: true,
      price: true,
      stats: true, // 스탯도 포함
    },
  });
};

// 아이템 생성
export const createItem = async (name, price, stats) => {
  return await prisma.item.create({
    data: {
      name,
      price,
      stats,
    },
  });
};

// 아이템 수정
export const updateItem = async (itemId, name, price, stats) => {
  return await prisma.item.update({
    where: { itemId: parseInt(itemId, 10) },
    data: {
      name,
      price,
      stats,
    },
  });
};