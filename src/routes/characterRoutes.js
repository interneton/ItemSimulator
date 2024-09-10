import express from 'express';
import { createCharacter } from '../controllers/characterController.js';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';

const router = express.Router();

// 캐릭터 생성 라우트 (JWT 인증 필요)
router.post('/create', authenticateJWT, createCharacter);

export default router;
