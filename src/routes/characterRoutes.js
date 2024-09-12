import express from 'express';
import {  create,  remove,  getDetails,  earnMoney,  getAllCharacters,  getInventory,  getEquipped,} from '../controllers/characterController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

// 캐릭터 생성 라우트
router.post('/create', authenticateJWT, create);
// 캐릭터 삭제 라우트
router.delete('/delete/:characterId', authenticateJWT, remove);
// 모든 캐릭터 조회
router.get('/all', getAllCharacters);
// 캐릭터 정보 상세 조회 라우트
router.get('/:characterId', authenticateJWT, getDetails);
// 캐릭터 돈 벌기 라우트
router.post('/earn-money/:characterId', authenticateJWT, earnMoney);
// 캐릭터 인벤토리 조회 라우트
router.get('/inventory/:characterId',authenticateJWT, getInventory);
// 캐릭터 장착한 아이템 조회 라우트
router.get('/equipped/:characterId', authenticateJWT, getEquipped);

export default router;
