import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js'; 

// 정규식으로 영어 소문자와 숫자만 허용하는 패턴
const usernameRegex = /^[a-z0-9]+$/;

// 회원가입 처리
export const register = async (req, res, next) => {
  const { userId, password, confirmPassword } = req.body;

  try {
    // 아이디 중복 확인
    const existingUsername = await prisma.account.findUnique({
      where: { userId },
    });

    if (existingUsername) {
      return res.status(400).json({ error: '해당 아이디가 이미 존재합니다' });
    }

    // 아이디 형식 검증 (영어 소문자 + 숫자 조합인지 확인)
    if (!usernameRegex.test(userId)) {
      return res.status(400).json({ error: '아이디는 소문자와 숫자 조합으로만 만들 수 있습니다' });
    }

    // 비밀번호 길이 확인 (최소 6자 이상)
    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 최소 6자리 이상으로 설정해주세요' });
    }

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ error: '비밀번호가 서로 일치하지 않습니다' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = await prisma.account.create({
      data: {
        userId,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: '회원 가입에 성공하였습니다!', user: { id: newUser.id, userId: newUser.userId } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
    const { userId, password } = req.body;
  
    try {
      // 아이디로 사용자 찾기
      const user = await prisma.account.findUnique({
        where: { userId },
      });
  
      if (!user) {
        return res.status(401).json({ error: '아이디가 존재하지 않거나 틀렸습니다' });
      }
  
      // 비밀번호 비교
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: '비밀번호가 틀렸습니다' });
      }
  
      // JWT 발급
      const token = jwt.sign({ id: user.accountId, userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: '로그인 성공!!', token });
    } catch (error) {
      next(error);
    }
  };
