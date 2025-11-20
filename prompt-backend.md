# Prompt: Backend - API REST para Gestión de Candidatos

## Contexto del Proyecto

Estás trabajando en el proyecto **LTI - Talent Tracking System**, un sistema ATS para gestión de candidatos. El proyecto usa:
- **Express 4.19.2** como framework web
- **TypeScript 4.9.5**
- **Prisma 5.13.0** como ORM
- **PostgreSQL** como base de datos
- El servidor corre en el puerto **3010**
- El código actual está en `backend/src/index.ts`

## Objetivo

Implementar la API REST backend para la funcionalidad "Añadir Candidato al Sistema", incluyendo:
1. Sistema de autenticación mock (login que acepta cualquier credencial)
2. Endpoints CRUD para candidatos
3. Manejo de carga de archivos (CV en PDF o DOCX)
4. Validación de datos
5. Manejo de errores robusto

## Estructura de Carpetas a Crear

Organizar el código siguiendo el patrón MVC recomendado:

```
backend/src/
├── routes/
│   ├── auth.routes.ts
│   └── candidates.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   └── candidates.controller.ts
├── services/
│   └── candidates.service.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── upload.middleware.ts
├── utils/
│   ├── validation.ts
│   └── fileHandler.ts
└── index.ts
```

## Requisitos de Implementación

### 1. Autenticación Mock

**Endpoint: POST /api/auth/login**
- Recibe: `{ username: string, password: string }`
- Responde: `{ success: true, message: "Login exitoso", token: "mock-token-123" }`
- **IMPORTANTE**: No validar credenciales, aceptar cualquier usuario/contraseña
- Devolver siempre un token mock (puede ser un string fijo)
- Status code: 200

**Endpoint: POST /api/auth/logout**
- Responde: `{ success: true, message: "Logout exitoso" }`
- Status code: 200

**Middleware de Autenticación** (`auth.middleware.ts`):
- Crear middleware que verifique la presencia del token en el header `Authorization: Bearer <token>`
- **IMPORTANTE**: No validar el token real, solo verificar que existe
- Si no hay token, devolver 401
- Si hay token (cualquier valor), continuar

### 2. Endpoints de Candidatos

**POST /api/candidates**
- Crear un nuevo candidato
- Body debe incluir:
  ```json
  {
    "firstName": "string (obligatorio)",
    "lastName": "string (obligatorio)",
    "email": "string (obligatorio, formato email)",
    "phone": "string (opcional)",
    "address": "string (opcional)",
    "education": [
      {
        "institution": "string",
        "degree": "string",
        "fieldOfStudy": "string (opcional)",
        "startDate": "ISO date string (opcional)",
        "endDate": "ISO date string (opcional)",
        "isCurrent": "boolean (opcional)"
      }
    ],
    "workExperience": [
      {
        "company": "string",
        "position": "string",
        "description": "string (opcional)",
        "startDate": "ISO date string (opcional)",
        "endDate": "ISO date string (opcional)",
        "isCurrent": "boolean (opcional)"
      }
    ]
  }
  ```
- Validar que email sea único
- Crear candidato con sus relaciones (education, workExperience)
- Responde: `{ success: true, data: { candidate: {...}, education: [...], workExperience: [...] } }`
- Status code: 201

**GET /api/candidates**
- Obtener lista de candidatos (paginada)
- Query params: `?page=1&limit=10` (opcionales, defaults: page=1, limit=10)
- Responde: `{ success: true, data: { candidates: [...], pagination: { page, limit, total, totalPages } } }`
- Status code: 200

**GET /api/candidates/:id**
- Obtener un candidato por ID con sus relaciones
- Responde: `{ success: true, data: { candidate: {...}, education: [...], workExperience: [...] } }`
- Si no existe: 404 con `{ success: false, error: "Candidato no encontrado" }`
- Status code: 200 o 404

**PUT /api/candidates/:id**
- Actualizar un candidato existente
- Body igual que POST (todos los campos opcionales)
- Actualizar también education y workExperience (reemplazar completamente)
- Responde: `{ success: true, data: { candidate: {...}, education: [...], workExperience: [...] } }`
- Status code: 200 o 404

**DELETE /api/candidates/:id**
- Eliminar un candidato (cascade eliminará education y workExperience)
- Si tiene CV, eliminar también el archivo del servidor
- Responde: `{ success: true, message: "Candidato eliminado exitosamente" }`
- Status code: 200 o 404

**POST /api/candidates/:id/cv**
- Subir CV del candidato
- Content-Type: `multipart/form-data`
- Campo del formulario: `cv` (archivo)
- Validar que sea PDF o DOCX
- Tamaño máximo: 10MB
- Guardar en carpeta `backend/uploads/cvs/`
- Nombre del archivo: `candidate-{id}-{timestamp}.{ext}`
- Actualizar campos `cvFileName`, `cvFilePath`, `cvMimeType` en el candidato
- Responde: `{ success: true, data: { cvFileName, cvFilePath, cvMimeType } }`
- Status code: 200

**GET /api/candidates/:id/cv**
- Descargar CV del candidato
- Leer archivo del servidor
- Enviar como descarga con headers apropiados
- Status code: 200 o 404 si no existe

### 3. Validación de Datos

Crear funciones de validación en `utils/validation.ts`:

- Validar formato de email (regex básico)
- Validar campos obligatorios
- Validar que fechas sean válidas
- Validar que endDate sea posterior a startDate (si ambas existen)
- Validar tipos de archivo para CV (PDF, DOCX)
- Validar tamaño de archivo (10MB máximo)

### 4. Manejo de Archivos

Crear funciones en `utils/fileHandler.ts`:

- `saveFile(file, candidateId)`: Guardar archivo CV
- `deleteFile(filePath)`: Eliminar archivo CV
- `getFile(filePath)`: Leer archivo para descarga
- Validar extensión y tipo MIME
- Generar nombres únicos para archivos

### 5. Middleware

**Error Middleware** (`error.middleware.ts`):
- Capturar todos los errores
- Formatear respuestas de error consistentes
- Logs en consola para desarrollo
- No exponer detalles internos en producción

**Upload Middleware** (`upload.middleware.ts`):
- Usar `multer` para manejar multipart/form-data
- Validar tipo de archivo
- Validar tamaño
- Configurar destino: `backend/uploads/cvs/`

### 6. Configuración CORS

- Habilitar CORS para permitir requests desde `http://localhost:3000`
- Configurar headers apropiados

### 7. Estructura de Respuestas

Todas las respuestas deben seguir este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensaje opcional"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error",
  "details": "Detalles adicionales (solo en desarrollo)"
}
```

## Dependencias Necesarias

Instalar las siguientes dependencias:

```bash
npm install multer @types/multer cors @types/cors
```

## Código de Ejemplo para Estructura

### index.ts (actualizar)
```typescript
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import candidatesRoutes from './routes/candidates.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();
const prisma = new PrismaClient();
export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidatesRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

## Validaciones Específicas

1. **Email**: Debe ser único, formato válido
2. **firstName, lastName**: Obligatorios, mínimo 2 caracteres
3. **Fechas**: Formato ISO válido, endDate >= startDate
4. **Archivos CV**: Solo PDF o DOCX, máximo 10MB
5. **Arrays**: education y workExperience pueden estar vacíos

## Manejo de Errores

- **400**: Bad Request (validación fallida)
- **401**: Unauthorized (sin token)
- **404**: Not Found (candidato no existe)
- **409**: Conflict (email duplicado)
- **500**: Internal Server Error (errores del servidor)

## Testing

Preparar estructura para tests (no implementar aún, solo estructura):
- Tests para endpoints de autenticación
- Tests para CRUD de candidatos
- Tests para carga de archivos
- Tests de validación

## Notas Importantes

1. **Autenticación Mock**: El login debe aceptar CUALQUIER credencial y devolver siempre éxito
2. **Middleware de Auth**: Solo verificar que existe el token, no validar su contenido
3. **Carpeta uploads**: Crear `backend/uploads/cvs/` y agregar a `.gitignore`
4. **TypeScript**: Usar tipos estrictos, evitar `any`
5. **Prisma**: Usar transacciones para crear candidato con relaciones
6. **Seguridad**: En producción, esto debe cambiarse (por ahora es mock)

## Archivos a Crear/Modificar

- `backend/src/index.ts` (modificar)
- `backend/src/routes/auth.routes.ts` (crear)
- `backend/src/routes/candidates.routes.ts` (crear)
- `backend/src/controllers/auth.controller.ts` (crear)
- `backend/src/controllers/candidates.controller.ts` (crear)
- `backend/src/services/candidates.service.ts` (crear)
- `backend/src/middleware/auth.middleware.ts` (crear)
- `backend/src/middleware/error.middleware.ts` (crear)
- `backend/src/middleware/upload.middleware.ts` (crear)
- `backend/src/utils/validation.ts` (crear)
- `backend/src/utils/fileHandler.ts` (crear)
- `backend/.gitignore` (agregar `uploads/`)

