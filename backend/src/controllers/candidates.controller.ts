import { Request, Response, NextFunction } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  updateCandidateCV
} from '../services/candidates.service';
import {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateDateRange
} from '../utils/validation';
import { saveFile, deleteFile, getFile } from '../utils/fileHandler';
import { createError } from '../middleware/error.middleware';

export const createCandidateController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;

    // Validaciones
    const firstNameValidation = validateRequired(firstName, 'Nombre');
    if (!firstNameValidation.isValid) {
      throw createError(firstNameValidation.error!, 400);
    }

    const lastNameValidation = validateRequired(lastName, 'Apellido');
    if (!lastNameValidation.isValid) {
      throw createError(lastNameValidation.error!, 400);
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw createError(emailValidation.error!, 400);
    }

    const firstNameLength = validateMinLength(firstName, 2, 'Nombre');
    if (!firstNameLength.isValid) {
      throw createError(firstNameLength.error!, 400);
    }

    const lastNameLength = validateMinLength(lastName, 2, 'Apellido');
    if (!lastNameLength.isValid) {
      throw createError(lastNameLength.error!, 400);
    }

    // Validar fechas en educación
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        if (edu.startDate && edu.endDate) {
          const dateValidation = validateDateRange(edu.startDate, edu.endDate);
          if (!dateValidation.isValid) {
            throw createError(`Educación: ${dateValidation.error}`, 400);
          }
        }
      }
    }

    // Validar fechas en experiencia laboral
    if (workExperience && Array.isArray(workExperience)) {
      for (const exp of workExperience) {
        if (exp.startDate && exp.endDate) {
          const dateValidation = validateDateRange(exp.startDate, exp.endDate);
          if (!dateValidation.isValid) {
            throw createError(`Experiencia laboral: ${dateValidation.error}`, 400);
          }
        }
      }
    }

    const candidate = await createCandidate({
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience
    });

    res.status(201).json({
      success: true,
      data: {
        candidate,
        education: candidate.education,
        workExperience: candidate.workExperience
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidatesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getCandidates(page, limit);

    res.status(200).json({
      success: true,
      data: {
        candidates: result.candidates,
        pagination: result.pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de candidato inválido', 400);
    }

    const candidate = await getCandidateById(id);

    res.status(200).json({
      success: true,
      data: {
        candidate,
        education: candidate.education,
        workExperience: candidate.workExperience
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCandidateController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de candidato inválido', 400);
    }

    const { firstName, lastName, email, phone, address, education, workExperience } = req.body;

    // Validaciones solo si los campos están presentes
    if (firstName !== undefined) {
      const validation = validateRequired(firstName, 'Nombre');
      if (!validation.isValid) {
        throw createError(validation.error!, 400);
      }
      const lengthValidation = validateMinLength(firstName, 2, 'Nombre');
      if (!lengthValidation.isValid) {
        throw createError(lengthValidation.error!, 400);
      }
    }

    if (lastName !== undefined) {
      const validation = validateRequired(lastName, 'Apellido');
      if (!validation.isValid) {
        throw createError(validation.error!, 400);
      }
      const lengthValidation = validateMinLength(lastName, 2, 'Apellido');
      if (!lengthValidation.isValid) {
        throw createError(lengthValidation.error!, 400);
      }
    }

    if (email !== undefined) {
      const validation = validateEmail(email);
      if (!validation.isValid) {
        throw createError(validation.error!, 400);
      }
    }

    // Validar fechas en educación
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        if (edu.startDate && edu.endDate) {
          const dateValidation = validateDateRange(edu.startDate, edu.endDate);
          if (!dateValidation.isValid) {
            throw createError(`Educación: ${dateValidation.error}`, 400);
          }
        }
      }
    }

    // Validar fechas en experiencia laboral
    if (workExperience && Array.isArray(workExperience)) {
      for (const exp of workExperience) {
        if (exp.startDate && exp.endDate) {
          const dateValidation = validateDateRange(exp.startDate, exp.endDate);
          if (!dateValidation.isValid) {
            throw createError(`Experiencia laboral: ${dateValidation.error}`, 400);
          }
        }
      }
    }

    const candidate = await updateCandidate(id, {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      workExperience
    });

    res.status(200).json({
      success: true,
      data: {
        candidate,
        education: candidate.education,
        workExperience: candidate.workExperience
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCandidateController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de candidato inválido', 400);
    }

    const candidate = await deleteCandidate(id);

    // Eliminar archivo CV si existe
    if (candidate.cvFilePath) {
      await deleteFile(candidate.cvFilePath);
    }

    res.status(200).json({
      success: true,
      message: 'Candidato eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export const uploadCVController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de candidato inválido', 400);
    }

    if (!req.file) {
      throw createError('No se proporcionó ningún archivo', 400);
    }

    // Verificar que el candidato existe
    await getCandidateById(id);

    // Guardar archivo
    const { fileName, filePath, mimeType } = await saveFile(req.file, id);

    // Actualizar candidato con información del CV
    await updateCandidateCV(id, fileName, filePath, mimeType);

    res.status(200).json({
      success: true,
      data: {
        cvFileName: fileName,
        cvFilePath: filePath,
        cvMimeType: mimeType
      }
    });
  } catch (error) {
    next(error);
  }
};

export const downloadCVController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw createError('ID de candidato inválido', 400);
    }

    const candidate = await getCandidateById(id);

    if (!candidate.cvFilePath) {
      throw createError('El candidato no tiene CV cargado', 404);
    }

    const { buffer, mimeType, fileName } = await getFile(candidate.cvFilePath);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

