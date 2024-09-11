import express from 'express';
import { createItem, updateItem, getAllItems, getItemById } from '../controllers/itemController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

// 아이템 생성 라우트
router.post('/create', createItem);

// 아이템 수정 라우트
router.put('/update/:itemId', updateItem);

// 모든 아이템 목록 조회 라우트
router.get('/list', getAllItems);

// 아이템 상세 조회 라우트
router.get('/:itemId', getItemById);  // URI 파라미터로 itemId 전달

export default router;
