import jwt from 'jsonwebtoken';
import { JwtPayload as AppPayload } from '../types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const generateAccessToken = (payload: AppPayload): string => {
  return jwt.sign(payload as object, JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: AppPayload): string => {
  return jwt.sign(payload as object, JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AppPayload => {
  try {
    return jwt.verify(token, JWT_SECRET!) as AppPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

export const verifyRefreshToken = (token: string): AppPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET!) as AppPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Refresh token verification failed');
  }
};
