/**
 * 에러 처리 미들웨어
 */
export const errorHandler = (err, req, res, next) => {
    console.error(err); // 서버에서 에러 로깅
  
    const statusCode = err.statusCode || 500; // 기본값은 500 (서버 오류)
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // 개발 환경에서는 스택 트레이스를 함께 반환
    });
  };
  