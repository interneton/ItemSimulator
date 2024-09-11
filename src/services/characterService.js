import { prisma } from '../utils/prisma/index.js';

// 캐릭터 생성
export const createCharacter = async (name, userId) => {
  return prisma.character.create({
    data: { name, accountId: userId },
  });
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
export const deleteCharacterById = async (characterId, userId) => {
  return prisma.character.deleteMany({
    where: { characterId, accountId: userId },
  });
};
