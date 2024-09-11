import express from 'express';
import { createItem, updateItem, getAllItems, getItemById, equipItem, unequipItem} from '../controllers/itemController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

// 아이템 생성 라우트
router.post('/create', createItem);
// 아이템 수정 라우트
router.put('/update/:itemId', updateItem);
// 모든 아이템 목록 조회 라우트
router.get('/list', getAllItems);
// 특정 아이템 상세 조회 라우트
router.get('/:itemId', getItemById);
// 아이템 장착 라우트
router.post('/equip/:characterId', authenticateJWT, equipItem);
// 아이템 탈착 라우트
router.post('/unequip/:characterId', authenticateJWT, unequipItem);

export default router;
