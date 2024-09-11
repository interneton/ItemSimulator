import { PrismaClient } from '@prisma/client';
import { config } from '../../config.js';  // config.js에서 설정 불러오기

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.dbUrl,  // config.dbUrl 사용하여 데이터베이스 URL 설정
    },
  },
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});
