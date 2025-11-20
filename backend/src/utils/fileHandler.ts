import fs from 'fs/promises';
import path from 'path';
import { validateFile } from './validation';

const UPLOADS_DIR = path.join(__dirname, '../../uploads/cvs');

export const ensureUploadsDir = async (): Promise<void> => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};

export const saveFile = async (file: Express.Multer.File, candidateId: number): Promise<{ fileName: string; filePath: string; mimeType: string }> => {
  await ensureUploadsDir();

  // Validar archivo
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Archivo inválido');
  }

  // Generar nombre único: candidate-{id}-{timestamp}.{ext}
  const timestamp = Date.now();
  const fileExtension = path.extname(file.originalname);
  const fileName = `candidate-${candidateId}-${timestamp}${fileExtension}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  // Guardar archivo
  await fs.writeFile(filePath, file.buffer);

  return {
    fileName,
    filePath,
    mimeType: file.mimetype
  };
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // Si el archivo no existe, no es un error crítico
    console.warn(`No se pudo eliminar el archivo ${filePath}:`, error);
  }
};

export const getFile = async (filePath: string): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> => {
  try {
    await fs.access(filePath);
    const buffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    
    // Determinar MIME type basado en extensión
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'application/octet-stream';
    if (ext === '.pdf') {
      mimeType = 'application/pdf';
    } else if (ext === '.docx') {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (ext === '.doc') {
      mimeType = 'application/msword';
    }

    return { buffer, mimeType, fileName };
  } catch (error) {
    throw new Error(`No se pudo leer el archivo: ${filePath}`);
  }
};

