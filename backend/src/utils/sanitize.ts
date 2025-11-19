import { User, UserResponse } from '../types';

export const sanitizeUser = (user: User): UserResponse => {
  const { password, ...sanitized } = user;
  return sanitized;
};