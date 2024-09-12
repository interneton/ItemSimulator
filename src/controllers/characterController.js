import {
  findCharacterById,  updateCharacterMoney,  createCharacter,  deleteCharacterById,  findAllCharacters,  getCharacterInventory,  getEquippedItems,
} from '../services/characterService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { CustomError } from '../utils/customError.js';
import { validateId } from '../utils/validateId.js';

// 캐릭터 생성
export const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const accountId = req.user?.accountId;

  if (!name || !accountId) {
    throw new CustomError('캐릭터 이름 또는 계정이 존재하지 않습니다.', 400);
  }

  const result = await createCharacter(name, accountId);
  res.status(201).json({
    message: '캐릭터 생성 완료',
    characterId: result.characterId,
  });
});

// 캐릭터 삭제
export const remove = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const accountId = req.user?.accountId;

  // validateId를 사용하여 characterId 유효성 검사
  const parsedCharacterId = validateId(characterId);

  const character = await findCharacterById(parsedCharacterId);
  if (!character) {
    throw new CustomError('해당 캐릭터가 존재하지 않습니다.', 404);
  }

  if (character.accountId !== accountId) {
    throw new CustomError('해당 캐릭터를 삭제할 권한이 없습니다.', 403);
  }

  await deleteCharacterById(parsedCharacterId, accountId);
  res.status(200).json({ message: '캐릭터 삭제 성공' });
});

// 캐릭터 정보 세부 조회
export const getDetails = asyncHandler(async (req, res) => {
  const accountId = req.user?.accountId;
  const { characterId } = req.params;

  // validateId로 characterId 유효성 검사
  const parsedCharacterId = validateId(characterId);

  // 캐릭터 조회
  const character = await findCharacterById(parsedCharacterId);
  if (!character) {
    throw new CustomError('해당 캐릭터가 존재하지 않습니다.', 404);
  }

  // 캐릭터가 현재 사용자의 계정에 속하는지 확인
  if (character.accountId === accountId) {
    // 자신의 캐릭터인 경우 모든 정보 반환
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

  // validateId로 characterId 유효성 검사
  const parsedCharacterId = validateId(characterId);

  const updatedCharacter = await updateCharacterMoney(parsedCharacterId, amount);
  res.status(200).json({
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
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);

  const inventory = await getCharacterInventory(parsedCharacterId, accountId);
  if (!inventory) {
    throw new CustomError('해당 캐릭터의 인벤토리를 찾을 수 없습니다.', 404);
  }

  res.status(200).json(inventory);
});

// 캐릭터 장착한 아이템 조회
export const getEquipped = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);

  const equippedItems = await getEquippedItems(parsedCharacterId, accountId);
  if (!equippedItems) {
    throw new CustomError('장착된 아이템을 찾을 수 없습니다.', 404);
  }

  res.status(200).json(equippedItems);
});
