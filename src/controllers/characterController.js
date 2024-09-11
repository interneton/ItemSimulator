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

export const deleteCharacter = async (req, res, next) => {
  const { characterId } = req.params;
  const userId = req.locals.user?.userId; // JWT에서 추출한 userId 확인

  try {
    // userId로 계정 조회
    const userAccount = await prisma.account.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      return res.status(404).json({ error: '계정이 존재하지 않습니다' });
    }

    // 삭제하려는 캐릭터가 해당 사용자의 캐릭터인지 확인
    const character = await prisma.character.findUnique({
      where: { characterId: parseInt(characterId, 10) }, // characterId가 문자열이므로 정수로 변환
    });

    if (!character || character.accountId !== userAccount.accountId) {
      return res.status(403).json({ error: '해당 캐릭터를 삭제할 권한이 없습니다' });
    }

    // 캐릭터 삭제
    await prisma.character.delete({
      where: { characterId: parseInt(characterId, 10) },
    });

    res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export const getCharacterDetails = async (req, res, next) => {
  const { characterId } = req.params;
  const userId = req.locals.user?.userId; // JWT에서 추출한 userId 확인

  try {
    const userAccount = await prisma.account.findUnique({
      where: { userId },
    });

    if (!userAccount) {
      return res.status(404).json({ error: '계정이 존재하지 않습니다' });
    }

    // 캐릭터 조회
    const character = await prisma.character.findUnique({
      where: { characterId: parseInt(characterId, 10) },
      select: {
        name: true,
        hp: true,
        strength: true,
        accountId: true,  // 해당 캐릭터의 소유자 확인용
        money: true,  // 게임 머니 필드 (money)
      },
    });

    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }

    // 본인의 캐릭터인 경우 게임 머니도 반환
    const isOwner = character.accountId === userAccount.accountId;
    const characterDetails = {
      name: character.name,
      hp: character.hp,
      strength: character.strength,
      ...(isOwner && { money: character.money }), // 본인 캐릭터일 경우에만 게임 머니 추가
    };

    res.status(200).json(characterDetails);
  } catch (error) {
    next(error);
  }
};
