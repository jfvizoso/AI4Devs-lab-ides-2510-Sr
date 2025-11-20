import { Request, Response, NextFunction } from 'express';
import { createError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    token: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError('Token de autenticación requerido', 401);
  }

  const token = authHeader.substring(7); // Remover "Bearer "

  if (!token || token.trim() === '') {
    throw createError('Token de autenticación inválido', 401);
  }

  // Mock: Cualquier token es válido, solo verificamos que existe
  req.user = { token };
  next();
};

