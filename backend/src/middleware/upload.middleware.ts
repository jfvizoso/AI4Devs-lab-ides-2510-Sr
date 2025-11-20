import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { createError } from './error.middleware';
import path from 'path';

// Configurar almacenamiento en memoria para procesar archivos
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(createError('Solo se permiten archivos PDF o DOCX', 400));
  }
};

// Configurar multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const uploadCV = (req: Request, res: Response, next: NextFunction): void => {
  const uploadSingle = upload.single('cv');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(createError('El archivo excede el tamaño máximo de 10MB', 400));
        }
        return next(createError(`Error al subir archivo: ${err.message}`, 400));
      }
      return next(err);
    }
    next();
  });
};

