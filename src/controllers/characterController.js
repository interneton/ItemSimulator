import { findCharacterById, updateCharacterMoney, createCharacter, deleteCharacterById } from '../services/characterService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// 캐릭터 생성
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.locals.user?.userId;

  const newCharacter = await createCharacter(name, userId);
  res.status(201).json({ message: '캐릭터 생성 완료', characterId: newCharacter.characterId });
});

// 캐릭터 삭제
export const remove = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const userId = req.locals.user?.userId;

  await deleteCharacterById(characterId, userId);
  res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
});

// 캐릭터 정보 세부 조회
export const getDetails = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const character = await findCharacterById(characterId);
  res.status(200).json(character);
});

// 캐릭터 돈 벌기
export const earnMoney = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { amount } = req.body;

  const updatedCharacter = await updateCharacterMoney(characterId, amount);
  res.status(200).json({ message: '게임 머니 획득 완료', remainingMoney: updatedCharacter.money });
});
