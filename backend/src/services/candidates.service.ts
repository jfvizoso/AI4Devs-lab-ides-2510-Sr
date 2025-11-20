import prisma from '../index';
import { Prisma } from '@prisma/client';
import { createError } from '../middleware/error.middleware';

export interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }>;
  workExperience?: Array<{
    company: string;
    position: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }>;
}

export interface UpdateCandidateData extends Partial<CreateCandidateData> {}

export const createCandidate = async (data: CreateCandidateData) => {
  // Verificar si el email ya existe
  const existingCandidate = await prisma.candidate.findUnique({
    where: { email: data.email }
  });

  if (existingCandidate) {
    throw createError('El email ya está registrado', 409);
  }

  // Preparar datos de educación
  const educationData = data.education?.map(edu => ({
    institution: edu.institution,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy || null,
    startDate: edu.startDate ? new Date(edu.startDate) : null,
    endDate: edu.endDate ? new Date(edu.endDate) : null,
    isCurrent: edu.isCurrent || false
  })) || [];

  // Preparar datos de experiencia laboral
  const workExperienceData = data.workExperience?.map(exp => ({
    company: exp.company,
    position: exp.position,
    description: exp.description || null,
    startDate: exp.startDate ? new Date(exp.startDate) : null,
    endDate: exp.endDate ? new Date(exp.endDate) : null,
    isCurrent: exp.isCurrent || false
  })) || [];

  // Crear candidato con relaciones usando transacción
  const candidate = await prisma.candidate.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      address: data.address || null,
      education: {
        create: educationData
      },
      workExperience: {
        create: workExperienceData
      }
    },
    include: {
      education: true,
      workExperience: true
    }
  });

  return candidate;
};

export const getCandidates = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      skip,
      take: limit,
      include: {
        education: true,
        workExperience: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.candidate.count()
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    candidates,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

export const getCandidateById = async (id: number) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      education: true,
      workExperience: true
    }
  });

  if (!candidate) {
    throw createError('Candidato no encontrado', 404);
  }

  return candidate;
};

export const updateCandidate = async (id: number, data: UpdateCandidateData) => {
  // Verificar que el candidato existe
  const existingCandidate = await prisma.candidate.findUnique({
    where: { id }
  });

  if (!existingCandidate) {
    throw createError('Candidato no encontrado', 404);
  }

  // Si se está actualizando el email, verificar que no esté en uso
  if (data.email && data.email !== existingCandidate.email) {
    const emailExists = await prisma.candidate.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw createError('El email ya está registrado', 409);
    }
  }

  // Preparar datos de actualización
  const updateData: Prisma.CandidateUpdateInput = {};

  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.address !== undefined) updateData.address = data.address || null;

  // Si se proporcionan education o workExperience, reemplazar completamente
  if (data.education !== undefined) {
    // Eliminar educación existente
    await prisma.education.deleteMany({
      where: { candidateId: id }
    });

    // Crear nueva educación
    if (data.education.length > 0) {
      updateData.education = {
        create: data.education.map(edu => ({
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy || null,
          startDate: edu.startDate ? new Date(edu.startDate) : null,
          endDate: edu.endDate ? new Date(edu.endDate) : null,
          isCurrent: edu.isCurrent || false
        }))
      };
    }
  }

  if (data.workExperience !== undefined) {
    // Eliminar experiencia existente
    await prisma.workExperience.deleteMany({
      where: { candidateId: id }
    });

    // Crear nueva experiencia
    if (data.workExperience.length > 0) {
      updateData.workExperience = {
        create: data.workExperience.map(exp => ({
          company: exp.company,
          position: exp.position,
          description: exp.description || null,
          startDate: exp.startDate ? new Date(exp.startDate) : null,
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          isCurrent: exp.isCurrent || false
        }))
      };
    }
  }

  // Actualizar candidato
  const candidate = await prisma.candidate.update({
    where: { id },
    data: updateData,
    include: {
      education: true,
      workExperience: true
    }
  });

  return candidate;
};

export const deleteCandidate = async (id: number) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id }
  });

  if (!candidate) {
    throw createError('Candidato no encontrado', 404);
  }

  // Eliminar candidato (las relaciones se eliminan en cascade)
  await prisma.candidate.delete({
    where: { id }
  });

  return candidate; // Devolver para poder eliminar el archivo CV si existe
};

export const updateCandidateCV = async (
  id: number,
  cvFileName: string,
  cvFilePath: string,
  cvMimeType: string
) => {
  const candidate = await prisma.candidate.update({
    where: { id },
    data: {
      cvFileName,
      cvFilePath,
      cvMimeType
    }
  });

  return candidate;
};

