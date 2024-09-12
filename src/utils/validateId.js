import { CustomError } from './customError.js';

export const validateId = (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new CustomError('유효하지 않은 ID입니다.', 400);
  }
  return parsedId;
};
