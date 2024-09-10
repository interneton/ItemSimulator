import jwt from 'jsonwebtoken';

/**
 * JWT 인증 미들웨어
 */
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('Authorization header is missing');
    error.statusCode = 401;
    return next(error); // next()를 통해 에러 미들웨어로 전달
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
    const error = new Error('Authorization header must be in the format: Bearer <token>');
    error.statusCode = 400;
    return next(error);
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new Error('JWT has expired');
        error.statusCode = 401;
        return next(error);
      } else {
        const error = new Error('Invalid JWT token');
        error.statusCode = 403;
        return next(error);
      }
    }

    req.locals = req.locals || {};
    req.locals.user = user;
    next();
  });
};
