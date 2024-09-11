import {
  purchaseItemForCharacter,
  sellItemFromCharacter,
  equipItemToCharacter,
  unequipItemFromCharacter,
} from '../services/itemService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// 아이템 생성
export const createItem = asyncHandler(async (req, res) => {
  const { name, stats, price } = req.body;

  const newItem = await prisma.item.create({
    data: { name, stats, price },
  });

  res.status(201).json({ message: '아이템이 생성되었습니다.', item: newItem });
});

// 아이템 수정
export const updateItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { name, stats } = req.body;

  const updatedItem = await prisma.item.update({
    where: { itemId: parseInt(itemId, 10) },
    data: {
      name, // 이름 수정
      stats, // JSON 형식의 스탯 수정
    },
  });

  res
    .status(200)
    .json({ message: '아이템이 수정되었습니다.', item: updatedItem });
});

// 모든 아이템 조회
export const getAllItems = asyncHandler(async (req, res) => {
  const items = await prisma.item.findMany();
  res.status(200).json(items);
});

// 특정 아이템 상세 조회
export const getItemById = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await prisma.item.findUnique({
    where: { itemId: parseInt(itemId, 10) },
  });

  if (!item) {
    return res.status(404).json({ error: '아이템을 찾을 수 없습니다.' });
  }

  res.status(200).json(item);
});

// 아이템 구매
export const purchaseItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId, quantity } = req.body;

  const updatedCharacter = await purchaseItemForCharacter(
    characterId,
    itemId,
    quantity,
  );
  res.status(200).json({
    message: '아이템 구매 완료',
    remainingMoney: updatedCharacter.money,
  });
});

// 아이템 판매
export const sellItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId, quantity } = req.body;

  const updatedCharacter = await sellItemFromCharacter(
    characterId,
    itemId,
    quantity,
  );
  res.status(200).json({
    message: '아이템 판매 완료',
    remainingMoney: updatedCharacter.money,
  });
});

// 아이템 장착
export const equipItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId } = req.body;

  const updatedCharacter = await equipItemToCharacter(characterId, itemId);
  res
    .status(200)
    .json({ message: '아이템 장착 완료', updatedStats: updatedCharacter });
});

// 아이템 탈착
export const unequipItem = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  const { itemId } = req.body;

  const updatedCharacter = await unequipItemFromCharacter(characterId, itemId);
  res
    .status(200)
    .json({ message: '아이템 탈착 완료', updatedStats: updatedCharacter });
});
