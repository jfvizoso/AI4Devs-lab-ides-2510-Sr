# Prompt: Base de Datos - Modelo de Candidato

## Contexto del Proyecto

Estás trabajando en el proyecto **LTI - Talent Tracking System**, un sistema ATS (Applicant Tracking System) para gestión de candidatos. El proyecto usa:
- **PostgreSQL** como base de datos (corriendo en Docker)
- **Prisma 5.13.0** como ORM
- **TypeScript 4.9.5**
- El schema actual está en `backend/prisma/schema.prisma`

## Objetivo

Crear el modelo de base de datos para almacenar la información de candidatos según los requisitos de la historia de usuario "Añadir Candidato al Sistema".

## Requisitos del Modelo

### Modelo Candidate (Candidato)

El modelo debe incluir los siguientes campos:

1. **Información Personal Básica**:
   - `id`: Identificador único (autoincremental)
   - `firstName`: Nombre del candidato (obligatorio, String)
   - `lastName`: Apellido del candidato (obligatorio, String)
   - `email`: Correo electrónico (obligatorio, único, String)
   - `phone`: Teléfono (opcional, String)
   - `address`: Dirección (opcional, String)

2. **CV/Documentos**:
   - `cvFileName`: Nombre del archivo del CV (opcional, String)
   - `cvFilePath`: Ruta donde se almacena el CV en el servidor (opcional, String)
   - `cvMimeType`: Tipo MIME del archivo (PDF o DOCX) (opcional, String)

3. **Metadatos**:
   - `createdAt`: Fecha de creación (DateTime, automático)
   - `updatedAt`: Fecha de última actualización (DateTime, automático)

### Modelo Education (Educación)

Modelo separado para almacenar múltiples registros de educación por candidato:

- `id`: Identificador único (autoincremental)
- `candidateId`: Relación con Candidate (Foreign Key)
- `institution`: Nombre de la institución (String)
- `degree`: Título obtenido (String)
- `fieldOfStudy`: Campo de estudio (opcional, String)
- `startDate`: Fecha de inicio (opcional, DateTime)
- `endDate`: Fecha de finalización (opcional, DateTime)
- `isCurrent`: Indica si está en curso (Boolean, default: false)
- `createdAt`: Fecha de creación (DateTime, automático)
- `updatedAt`: Fecha de última actualización (DateTime, automático)

### Modelo WorkExperience (Experiencia Laboral)

Modelo separado para almacenar múltiples registros de experiencia laboral por candidato:

- `id`: Identificador único (autoincremental)
- `candidateId`: Relación con Candidate (Foreign Key)
- `company`: Nombre de la empresa (String)
- `position`: Puesto de trabajo (String)
- `description`: Descripción de responsabilidades (opcional, String - usar tipo Text para textos largos)
- `startDate`: Fecha de inicio (opcional, DateTime)
- `endDate`: Fecha de finalización (opcional, DateTime)
- `isCurrent`: Indica si es el trabajo actual (Boolean, default: false)
- `createdAt`: Fecha de creación (DateTime, automático)
- `updatedAt`: Fecha de última actualización (DateTime, automático)

## Relaciones

- Un `Candidate` puede tener múltiples `Education` (relación 1:N)
- Un `Candidate` puede tener múltiples `WorkExperience` (relación 1:N)
- Las relaciones deben usar `onDelete: Cascade` para eliminar registros relacionados cuando se elimine un candidato

## Especificaciones Técnicas

1. **Nombres de modelos**: Usar PascalCase (Candidate, Education, WorkExperience)
2. **Nombres de campos**: Usar camelCase (firstName, lastName, etc.)
3. **Tipos de datos**:
   - Strings para texto corto
   - Text para descripciones largas
   - DateTime para fechas
   - Boolean para flags
4. **Constraints**:
   - `email` debe ser único
   - `candidateId` en Education y WorkExperience debe ser obligatorio
5. **Índices**: Agregar índice en `email` del modelo Candidate para búsquedas rápidas

## Estructura del Schema

El schema debe:
- Mantener el modelo `User` existente (no modificarlo)
- Agregar los nuevos modelos después del modelo User
- Incluir todos los campos especificados
- Definir las relaciones correctamente
- Usar los tipos de Prisma apropiados

## Archivo a Modificar

- `backend/prisma/schema.prisma`

## Pasos a Seguir

1. Abrir el archivo `backend/prisma/schema.prisma`
2. Agregar el modelo `Candidate` con todos los campos especificados
3. Agregar el modelo `Education` con la relación a Candidate
4. Agregar el modelo `WorkExperience` con la relación a Candidate
5. Verificar que la sintaxis de Prisma sea correcta
6. Ejecutar `npx prisma format` para formatear el schema
7. Crear la migración con `npx prisma migrate dev --name add_candidate_models`
8. Generar el Prisma Client con `npm run prisma:generate`

## Validaciones a Considerar

- El email debe ser único en la base de datos
- Los campos obligatorios no deben ser null
- Las fechas de fin deben ser posteriores a las fechas de inicio (esto se validará en el backend, no en el schema)

## Notas Adicionales

- El modelo User existente debe permanecer intacto
- Los campos opcionales deben usar `?` en Prisma
- Usar `@default(now())` para createdAt
- Usar `@updatedAt` para updatedAt (Prisma lo maneja automáticamente)
- Considerar usar `@map` si es necesario mapear nombres de columnas diferentes

