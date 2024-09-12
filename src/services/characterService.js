import { prisma } from '../utils/prisma/index.js';

// 캐릭터 생성
export const createCharacter = async (name, accountId) => {
  // 먼저 이름이 중복되는 캐릭터가 있는지 확인합니다.
  const existingCharacter = await prisma.character.findFirst({
    where: { name },
  });

  if (existingCharacter) {
    return { error: '이미 해당 이름의 캐릭터가 존재합니다.', statusCode: 400 };
  }

  // 중복되지 않으면 캐릭터를 생성합니다.
  const newCharacter = await prisma.character.create({
    data: { name, accountId },
  });

  return { data: newCharacter, statusCode: 201 };
};

// 캐릭터 조회
export const findCharacterById = async (characterId) => {
  return prisma.character.findUnique({ where: { characterId } });
};

// 캐릭터 돈 업데이트
export const updateCharacterMoney = async (characterId, amount) => {
  return prisma.character.update({
    where: { characterId },
    data: { money: { increment: amount } },
  });
};

// 캐릭터 삭제
export const deleteCharacterById = async (characterId, accountId) => {
  return prisma.character.delete({
    where: { characterId, accountId: accountId },
  });
};

// 모든 캐릭터 조회
export const findAllCharacters = async () => {
  return await prisma.character.findMany({
    select: {
      characterId: true,
      name: true,
      health: true,
      strength: true,
    }
  });
};

// 캐릭터가 보유한 인벤토리 조회 (아이템 ID, 이름, 개수 반환)
export const getCharacterInventory = async (characterId, accountId) => {
  // 캐릭터의 소유자 확인
  const character = await prisma.character.findUnique({
    where: { characterId },
  });

  if (!character || character.accountId !== accountId) {
    return null; // 현재 계정에 속하지 않으면 null 반환
  }

  // 인벤토리 조회
  return await prisma.inventory.findMany({
    where: { characterId },
    select: {
      item: {
        select: {
          itemId: true,
          name: true,
        },
      },
      quantity: true,
    },
  });
};

// 캐릭터가 장착한 아이템 조회 (아이템 ID, 이름 반환)
export const getEquippedItems = async (characterId, accountId) => {
  // 캐릭터의 소유자 확인
  const character = await prisma.character.findUnique({
    where: { characterId },
  });

  if (!character || character.accountId !== accountId) {
    return null; // 현재 계정에 속하지 않으면 null 반환
  }

  // 장착한 아이템 조회
  return await prisma.equippedItem.findMany({
    where: { characterId },
    select: {
      item: {
        select: {
          itemId: true,
          name: true,
        },
      },
    },
  });
};