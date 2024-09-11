import { prisma } from '../utils/prisma/index.js';

// 유저 ID 검색
export const findUserByUserId = async (userId) => {
  return prisma.account.findUnique({ where: { userId } });
};

// 유저 생성
export const createUser = async (userId, password) => {
  return prisma.account.create({
    data: {
      userId,
      password,
    },
  });
};
