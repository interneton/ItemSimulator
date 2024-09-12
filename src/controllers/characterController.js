import {
  findCharacterById,  updateCharacterMoney,  createCharacter,  deleteCharacterById,  findAllCharacters,  getCharacterInventory,  getEquippedItems,
} from '../services/characterService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// 캐릭터 생성
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const accountId = req.user?.accountId;

  if (!name || !accountId) {
    return res.status(400).json({ error: '캐릭터 이름 또는 계정이 존재하지 않습니다.' });
  }

  const result = await createCharacter(name, accountId);

  if (result.error) {
    return res.status(result.statusCode).json({ error: result.error });
  }

  res.status(result.statusCode).json({
    message: '캐릭터 생성 완료',
    characterId: result.data.characterId,
  });
});

// 캐릭터 삭제
export const remove = asyncHandler(async (req, res, next) => {
  const accountId = req.user?.accountId;

  const { characterId } = req.params;

  // characterId를 정수로 변환 및 유효성 검사
  const parsedCharacterId = parseInt(characterId, 10);
  if (isNaN(parsedCharacterId)) {
    return res.status(400).json({ error: '유효하지 않은 characterId입니다.' });
  }

  if (!accountId) {
    return res.status(400).json({ error: '계정이 존재하지 않습니다' });
  }

  const character = await findCharacterById(parsedCharacterId);
  if (!character) {
    return res.status(404).json({ error: '해당 캐릭터가 존재하지 않습니다.' });
  }

  // 캐릭터가 현재 사용자의 계정에 속하는지 확인
  if (character.accountId !== accountId) {
    return res
      .status(403)
      .json({ error: '해당 캐릭터를 삭제할 권한이 없습니다.' });
  }

  await deleteCharacterById(characterId, accountId);
  res.status(200).json({ message: '캐릭터 삭제 성공' });
});

// 캐릭터 정보 세부 조회
export const getDetails = asyncHandler(async (req, res, next) => {
  const accountId = req.user?.accountId;

  const { characterId } = req.params;

  // characterId를 정수로 변환 및 유효성 검사
  const parsedCharacterId = parseInt(characterId, 10);
  if (isNaN(parsedCharacterId)) {
    return res.status(400).json({ error: '유효하지 않은 characterId입니다.' });
  }
  // 캐릭터 조회
  const character = await findCharacterById(parsedCharacterId);

  if (!character) {
    return res.status(404).json({ error: '해당 캐릭터가 존재하지 않습니다.' });
  }

  // 캐릭터가 현재 사용자의 계정에 속하는지 확인
  if (character.accountId === accountId) {
    // 자신의 캐릭터인 경우 모든 정보 반환 (이름, 능력치, 돈 등)
    res.status(200).json(character);
  } else {
    // 다른 사람의 캐릭터인 경우 돈을 제외한 정보만 반환
    const { name, health, strength } = character;
    res.status(200).json({ name, health, strength });
  }
});

// 캐릭터 돈 벌기
export const earnMoney = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const { characterId } = req.params;

  // characterId를 정수로 변환 및 유효성 검사
  const parsedCharacterId = parseInt(characterId, 10);
  if (isNaN(parsedCharacterId)) {
    return res.status(400).json({ error: '유효하지 않은 characterId입니다.' });
  }

  const updatedCharacter = await updateCharacterMoney(parsedCharacterId, amount);
  res
    .status(200)
    .json({
      message: '게임 머니 획득 완료',
      remainingMoney: updatedCharacter.money,
    });
});

// 모든 캐릭터 조회
export const getAllCharacters = asyncHandler(async (req, res) => {
  // 모든 캐릭터를 조회하는 서비스 함수 호출
  const characters = await findAllCharacters();

  // 각 캐릭터의 이름과 능력치만 반환
  const result = characters.map((character) => ({
    characterId: character.characterId,
    name: character.name,
    health: character.health,
    strength: character.strength,
  }));

  res.status(200).json(result);
});

// 캐릭터 인벤토리 조회
export const getInventory = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const accountId = req.user?.accountId; // JWT 인증 미들웨어에서 가져온 사용자 정보

  // characterId를 정수로 변환 및 유효성 검사
  const parsedCharacterId = parseInt(characterId, 10);
  if (isNaN(parsedCharacterId)) {
    return res.status(400).json({ error: '유효하지 않은 characterId입니다.' });
  }

  // 캐릭터가 현재 사용자의 계정에 속하는지 확인
  const inventory = await getCharacterInventory(parsedCharacterId, accountId);

  if (!inventory) {
    return res.status(404).json({ error: '해당 캐릭터의 인벤토리를 찾을 수 없습니다.' });
  }

  res.status(200).json(inventory);
});

// 캐릭터 장착한 아이템 조회
export const getEquipped = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const accountId = req.user?.accountId; // JWT 인증 미들웨어에서 가져온 사용자 정보

  // characterId를 정수로 변환 및 유효성 검사
  const parsedCharacterId = parseInt(characterId, 10);
  if (isNaN(parsedCharacterId)) {
    return res.status(400).json({ error: '유효하지 않은 characterId입니다.' });
  }

  // 캐릭터가 현재 사용자의 계정에 속하는지 확인
  const equippedItems = await getEquippedItems(parsedCharacterId, accountId);

  if (!equippedItems) {
    return res.status(404).json({ error: '장착된 아이템을 찾을 수 없습니다.' });
  }

  res.status(200).json(equippedItems);
});
