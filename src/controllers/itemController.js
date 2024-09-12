import {
  purchaseItemForCharacter,  sellItemFromCharacter,  equipItemToCharacter,  unequipItemFromCharacter,  findAllItems,  findItemById, createItem, updateItem,
} from '../services/itemService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { CustomError } from '../utils/customError.js';
import { validateId } from '../utils/validateId.js'; 

// 아이템 생성
export const createNewItem = asyncHandler(async (req, res) => {
  const { name, price, stats } = req.body;

  const newItem = await createItem(name, price, stats);

  res.status(201).json({ message: '아이템 생성 완료', item: newItem });
});

// 아이템 수정
export const modifyItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { name, price, stats } = req.body;

  const parsedItemId = validateId(itemId);
  const updatedItem = await updateItem(parsedItemId, name, price, stats);

  if (!updatedItem) {
    throw new CustomError('아이템을 찾을 수 없습니다.', 404);
  }

  res.status(200).json({ message: '아이템 수정 완료', item: updatedItem });
});

// 모든 아이템 조회 (아이템 ID, 이름, 가격만 반환)
export const getAllItems = asyncHandler(async (req, res) => {
  const items = await findAllItems(); // 서비스 계층 호출
  res.status(200).json(items);
});

// 특정 아이템 상세 조회 (아이템 ID, 이름, 가격, 스탯 포함)
export const getItemById = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const parsedItemId = validateId(itemId);
  const item = await findItemById(parsedItemId); // 서비스 계층 호출

  if (!item) {
    throw new CustomError('아이템을 찾을 수 없습니다.', 404);
  }

  res.status(200).json(item);
});

// 아이템 구매
export const purchaseItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId, quantity } = req.body;
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);
  const parsedItemId = validateId(itemId);

  const result = await purchaseItemForCharacter(parsedCharacterId, parsedItemId, quantity, accountId);
  if (result.error) {
    throw new CustomError(result.error, result.statusCode);
  }

  res.status(200).json({
    message: '아이템 구매 완료',
    remainingMoney: result.data.money,
  });
});

// 아이템 판매
export const sellItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId, quantity } = req.body;
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);
  const parsedItemId = validateId(itemId);

  const result = await sellItemFromCharacter(parsedCharacterId, parsedItemId, quantity, accountId);
  if (result.error) {
    throw new CustomError(result.error, result.statusCode);
  }

  res.status(200).json({
    message: '아이템 판매 완료',
    remainingMoney: result.data.money,
  });
});

// 아이템 장착
export const equipItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId } = req.body;
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);
  const parsedItemId = validateId(itemId);

  const result = await equipItemToCharacter(parsedCharacterId, parsedItemId, accountId);

  if (result.error) {
    throw new CustomError(result.error, result.statusCode);
  }

  res.status(200).json({
    message: '아이템 장착 완료',
    updatedStats: result.data,
  });
});

// 아이템 탈착
export const unequipItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId } = req.body;
  const accountId = req.user?.accountId;

  const parsedCharacterId = validateId(characterId);
  const parsedItemId = validateId(itemId);

  const result = await unequipItemFromCharacter(parsedCharacterId, parsedItemId, accountId);

  if (result.error) {
    throw new CustomError(result.error, result.statusCode);
  }

  res.status(200).json({
    message: '아이템 탈착 완료',
    updatedStats: result.data,
  });
});
