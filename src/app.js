import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

import authRoutes from './routes/authRoutes.js'; // 인증 라우트
import characterRoutes from './routes/characterRoutes.js'; // 캐릭터 라우트
import itemRoutes from './routes/itemRoutes.js'; // 아이템 라우트 추가

dotenv.config(); // 환경 변수 로드

const app = express();

app.use(express.json());

// 로그 미들웨어 적용
app.use(logger);

// 인증 관련 라우트
app.use('/auth', authRoutes);

// 캐릭터 생성 라우트 (JWT 인증 필요)
app.use('/character', characterRoutes);

// 아이템 라우트 (JWT 인증 필요)
app.use('/item', itemRoutes); // 아이템 라우트 추가

// 에러 처리 미들웨어
app.use(errorHandler);

// 서버 시작
app.listen(3000, () => {
  console.log('포트 3000 서버가 시작');
});
