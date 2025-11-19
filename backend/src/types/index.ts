// src/types/index.ts
import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified: boolean;
  created_at: Date;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}