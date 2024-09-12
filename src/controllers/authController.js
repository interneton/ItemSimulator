import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';  // config.js 불러오기
import { createUser, findUserByUserId } from '../services/authService.js';  // 서비스 계층 호출
import { asyncHandler } from '../middlewares/errorHandler.js';  // asyncHandler 불러오기

// 회원가입
export const register = asyncHandler(async (req, res) => {
  const { userId, password, confirmPassword } = req.body;

  const existingUser = await findUserByUserId(userId);
  if (existingUser) {
    return res.status(400).json({ error: '해당 아이디가 이미 존재합니다.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);  // 강력한 해싱 라운드 적용
  const newUser = await createUser(userId, hashedPassword);

  res.status(201).json({ message: '회원 가입 성공', user: { id: newUser.id, userId: newUser.userId } });
});

// 로그인
export const login = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  const user = await findUserByUserId(userId);
  if (!user) {
    return res.status(401).json({ error: '아이디가 존재하지 않습니다.' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ userId: user.userId,  accountId: user.accountId }, config.jwtSecret, { expiresIn: '1h' });  // 토큰 만료 시간 1시간 설정
  res.json({ message: '로그인 성공', token });
});