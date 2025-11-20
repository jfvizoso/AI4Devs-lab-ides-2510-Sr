import { Request, Response, NextFunction } from 'express';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Mock: Aceptar cualquier credencial
    // No validar username ni password
    const { username, password } = req.body;

    // Devolver token mock siempre
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token: 'mock-token-123'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    next(error);
  }
};

