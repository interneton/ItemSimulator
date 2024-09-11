import jwt from 'jsonwebtoken';
import { config } from '../config.js';  // config.js에서 설정 불러오기

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, user) => {  // config.jwtSecret 사용
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.locals.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' });
  }
};
