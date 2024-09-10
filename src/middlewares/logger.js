import winston from 'winston';

// Winston 로그 설정
const loggerInstance = winston.createLogger({
  level: 'info', // 로그 레벨 설정 (info, error 등)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }), // 로그 파일에 저장
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // 에러 로그를 별도 파일에 저장
    new winston.transports.Console() // 콘솔에도 로그 출력
  ],
});

// 로그 처리 미들웨어
export const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    // 요청 성공 로그는 info 레벨로 기록
    if (res.statusCode >= 400) {
      // 에러 상태코드인 경우는 error 레벨로 기록
      loggerInstance.error(logMessage);
    } else {
      loggerInstance.info(logMessage);
    }
  });

  next();
};
