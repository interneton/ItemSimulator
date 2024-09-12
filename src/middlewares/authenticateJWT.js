import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // '/character/all' 경로에 대해서는 JWT 없이도 통과 가능
    if (req.path.includes('/character/all')) {
      return next();
    }
    return res.status(403).json({ error: 'Token is missing' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
};
