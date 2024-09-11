import express from 'express';
import { create, remove, getDetails, earnMoney } from '../controllers/characterController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

// 캐릭터 생성 라우트
router.post('/create', authenticateJWT, create);
// 캐릭터 삭제 라우트
router.delete('/delete/:characterId', authenticateJWT, remove);
// 캐릭터 정보 상세 조회 라우트
router.get('/:characterId', authenticateJWT, getDetails);
// 캐릭터 돈 벌기 라우트
router.post('/earn-money/:characterId', authenticateJWT, earnMoney);

export default router;
