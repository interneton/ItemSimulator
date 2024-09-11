import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT.js';
import { createCharacter, deleteCharacter, getCharacterDetails } from '../controllers/characterController.js';

const router = express.Router();

// 캐릭터 생성 라우트 (JWT 인증 필요)
router.post('/create', authenticateJWT, createCharacter);

router.delete('/delete/:characterId', authenticateJWT, deleteCharacter);

router.get('/:characterId', authenticateJWT, getCharacterDetails);

export default router;
