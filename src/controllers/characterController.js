import { prisma } from '../utils/prisma/index.js';

// 캐릭터 생성 API
export const createCharacter = async (req, res, next) => {
  const { name } = req.body;
  const userId = req.locals.user?.userId; // JWT에서 추출한 userId 확인

  // userId가 없으면 오류 반환
  if (!userId) {
    return res.status(400).json({ error: '사용자 정보가 존재하지 않습니다' });
  }

  try {
    // userId로 계정 조회
    const userAccount = await prisma.account.findUnique({
      where: { userId }, // userId가 Prisma 모델에서 고유해야 합니다.
    });

    if (!userAccount) {
      return res.status(404).json({ error: '계정이 존재하지 않습니다' });
    }

    // 이미 존재하는 캐릭터명인지 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { name },
    });

    if (existingCharacter) {
      return res.status(400).json({ error: '캐릭터 이름이 이미 존재합니다' });
    }

    // 캐릭터 생성
    const newCharacter = await prisma.character.create({
      data: {
        name,
        accountId: userAccount.accountId, // 계정과 연결된 캐릭터 생성
      },
    });

    res.status(201).json({
      message: '캐릭터 생성 완료',
      characterId: newCharacter.characterId,
    });
  } catch (error) {
    next(error);
  }
};
