import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const response: {
    success: boolean;
    error: string;
    details?: string;
  } = {
    success: false,
    error: statusCode === 500 && !isDevelopment 
      ? 'Error interno del servidor' 
      : err.message || 'Algo salió mal'
  };

  if (isDevelopment && err.stack) {
    response.details = err.stack;
  }

  res.status(statusCode).json(response);
};

export const createError = (message: string, statusCode: number = 400): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};

