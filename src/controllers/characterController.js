import { prisma } from '../utils/prisma/index.js'; 

// 캐릭터 생성 API
export const createCharacter = async (req, res, next) => {
  const { name } = req.body;
  const userId = req.locals.user.id; // JWT 인증을 통해 가져온 사용자 ID

  try {
    // 이미 존재하는 캐릭터명인지 확인
    const existingCharacter = await prisma.character.findUnique({
      where: { name },
    });

    if (existingCharacter) {
      return res.status(400).json({ error: 'Character name already exists' });
    }

    // 캐릭터 생성
    const newCharacter = await prisma.character.create({
      data: {
        name,
        accountId: userId, // 로그인한 사용자의 ID와 연관
      },
    });

    res.status(201).json({
      message: 'Character created successfully',
      characterId: newCharacter.id,
      
    });
  } catch (error) {
    next(error);
  }
};
