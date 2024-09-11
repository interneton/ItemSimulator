import { prisma } from '../utils/prisma/index.js';

// 아이템 생성 API
export const createItem = async (req, res, next) => {
  const { name, stats, price } = req.body;

  try {
    // 아이템 이름이 중복되는지 확인
    const existingItem = await prisma.item.findUnique({
      where: { name },
    });

    if (existingItem) {
      return res.status(400).json({ error: '아이템 이름이 이미 존재합니다' });
    }

    // 아이템 생성
    const newItem = await prisma.item.create({
      data: {
        name,
        stats, // stats는 JSON 형식으로 처리
        price,
      },
    });

    res.status(201).json({ message: '아이템 생성 완료', item: newItem });
  } catch (error) {
    next(error);
  }
};

// 아이템 수정 API
export const updateItem = async (req, res, next) => {
    const { itemId } = req.params;
    const { name, stats } = req.body;
  
    try {
      // 아이템 ID로 해당 아이템 조회
      const item = await prisma.item.findUnique({
        where: { itemId: parseInt(itemId, 10) },
      });
  
      if (!item) {
        return res.status(404).json({ error: '해당 아이템을 찾을 수 없습니다' });
      }
  
      // 새로운 stats에 없는 키를 삭제하고 업데이트
      const updatedStats = { ...item.stats, ...stats };
  
      // 기존 stats에 있던 키 중 새로 전달되지 않은 키 제거
      Object.keys(item.stats).forEach((key) => {
        if (!stats[key]) {
          delete updatedStats[key];
        }
      });
  
      // 아이템 정보 업데이트 (price는 수정하지 않음)
      const updatedItem = await prisma.item.update({
        where: { itemId: parseInt(itemId, 10) },
        data: {
          name: name || item.name,
          stats: updatedStats,
        },
      });
  
      res.status(200).json({ message: '아이템 수정 완료', item: updatedItem });
    } catch (error) {
      next(error);
    }
  };

  export const getAllItems = async (req, res, next) => {
    try {
      // 모든 아이템을 DB에서 조회
      const items = await prisma.item.findMany({
        select: {
          itemId: true,
          name: true,
          price: true
        },
      });
  
      // 조회된 아이템 목록을 반환
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  };

  // itemController.js

// 아이템 상세 조회 API
export const getItemById = async (req, res, next) => {
    const { itemId } = req.params;
  
    try {
      // 아이템 ID로 아이템 조회
      const item = await prisma.item.findUnique({
        where: { itemId: parseInt(itemId, 10) },
        select: {
          itemId: true,
          name: true,
          stats: true,
          price: true
        },
      });
  
      if (!item) {
        return res.status(404).json({ error: '해당 아이템을 찾을 수 없습니다.' });
      }
  
      // 아이템 정보 반환
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  };
  
  
