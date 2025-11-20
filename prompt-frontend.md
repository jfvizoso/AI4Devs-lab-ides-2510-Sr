# Prompt: Frontend - Interfaz de Usuario para Gestión de Candidatos

## Contexto del Proyecto

Estás trabajando en el proyecto **LTI - Talent Tracking System**, un sistema ATS para gestión de candidatos. El proyecto usa:
- **React 18.3.1** con **TypeScript 4.9.5**
- **Create React App** (react-scripts 5.0.1)
- El frontend corre en el puerto **3000**
- El backend API está en `http://localhost:3010`
- El código actual está en `frontend/src/App.tsx`

## Objetivo

Implementar la interfaz de usuario para la funcionalidad "Añadir Candidato al Sistema", incluyendo:
1. Página de login mock (acepta cualquier credencial)
2. Dashboard del reclutador con botón para añadir candidato
3. Formulario completo para añadir candidato
4. Validación de formularios
5. Manejo de estados (loading, error, éxito)
6. Carga de archivos (CV)
7. Mensajes de confirmación y error

## Estructura de Carpetas a Crear

```
frontend/src/
├── components/
│   ├── Login/
│   │   └── Login.tsx
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── CandidateForm/
│   │   ├── CandidateForm.tsx
│   │   ├── EducationSection.tsx
│   │   ├── WorkExperienceSection.tsx
│   │   └── FileUpload.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Alert.tsx
│       └── LoadingSpinner.tsx
├── services/
│   └── api.ts
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── types/
│   └── index.ts
├── utils/
│   └── validation.ts
├── App.tsx
└── index.tsx
```

## Requisitos de Implementación

### 1. Sistema de Autenticación Mock

**Login Component** (`components/Login/Login.tsx`):
- Formulario con campos: `username` y `password`
- Botón "Iniciar Sesión"
- **IMPORTANTE**: No validar credenciales, enviar cualquier valor al backend
- Al hacer login exitoso, guardar token en localStorage
- Redirigir a `/dashboard` después del login
- Mostrar mensajes de error si el login falla

**AuthContext** (`context/AuthContext.tsx`):
- Crear contexto de autenticación
- Proporcionar: `user`, `login`, `logout`, `isAuthenticated`
- Usar localStorage para persistir token
- Verificar token al cargar la app

**Hook useAuth** (`hooks/useAuth.ts`):
- Hook personalizado para usar AuthContext fácilmente

### 2. Dashboard del Reclutador

**Dashboard Component** (`components/Dashboard/Dashboard.tsx`):
- Mostrar mensaje de bienvenida: "Bienvenido, Reclutador"
- Botón prominente y claramente visible: "Añadir Nuevo Candidato"
- El botón debe redirigir a `/candidates/new`
- Diseño limpio y profesional
- Header con opción de logout

### 3. Formulario de Candidato

**CandidateForm Component** (`components/CandidateForm/CandidateForm.tsx`):
- Formulario completo con todos los campos requeridos
- Secciones organizadas:
  - **Información Personal**
    - Nombre (obligatorio)
    - Apellido (obligatorio)
    - Email (obligatorio, validar formato)
    - Teléfono (opcional)
    - Dirección (opcional)
  
  - **Educación** (sección dinámica)
    - Botón "Añadir Educación"
    - Cada educación tiene:
      - Institución (obligatorio)
      - Título/Degree (obligatorio)
      - Campo de estudio (opcional)
      - Fecha inicio (opcional)
      - Fecha fin (opcional)
      - Checkbox "En curso"
    - Botón "Eliminar" para cada educación
  
  - **Experiencia Laboral** (sección dinámica)
    - Botón "Añadir Experiencia"
    - Cada experiencia tiene:
      - Empresa (obligatorio)
      - Puesto (obligatorio)
      - Descripción (opcional, textarea)
      - Fecha inicio (opcional)
      - Fecha fin (opcional)
      - Checkbox "Trabajo actual"
    - Botón "Eliminar" para cada experiencia
  
  - **CV**
    - Input de tipo file
    - Aceptar solo PDF y DOCX
    - Mostrar nombre del archivo seleccionado
    - Botón para eliminar selección
    - Indicar tamaño máximo (10MB)

- Botones de acción:
  - "Guardar Candidato" (submit)
  - "Cancelar" (volver al dashboard)

### 4. Componentes de Sección

**EducationSection** (`components/CandidateForm/EducationSection.tsx`):
- Componente reutilizable para cada entrada de educación
- Manejar estado local del formulario
- Validación básica

**WorkExperienceSection** (`components/CandidateForm/WorkExperienceSection.tsx`):
- Componente reutilizable para cada entrada de experiencia
- Manejar estado local del formulario
- Validación básica

**FileUpload** (`components/CandidateForm/FileUpload.tsx`):
- Componente para carga de archivos
- Validar tipo y tamaño
- Mostrar preview del nombre de archivo
- Mostrar errores de validación

### 5. Componentes Comunes

**Button** (`components/common/Button.tsx`):
- Botón reutilizable con variantes (primary, secondary, danger)
- Estados: disabled, loading
- Props: onClick, children, variant, type

**Input** (`components/common/Input.tsx`):
- Input reutilizable con label
- Manejo de errores
- Props: label, name, type, value, onChange, error, required

**Alert** (`components/common/Alert.tsx`):
- Componente para mensajes (éxito, error, info, warning)
- Props: type, message, onClose

**LoadingSpinner** (`components/common/LoadingSpinner.tsx`):
- Spinner de carga reutilizable

### 6. Servicio API

**api.ts** (`services/api.ts`):
- Función para configurar axios o fetch con base URL
- Interceptor para agregar token de autenticación
- Funciones para cada endpoint:
  - `login(username, password)`
  - `logout()`
  - `getCandidates(page, limit)`
  - `getCandidate(id)`
  - `createCandidate(data)`
  - `updateCandidate(id, data)`
  - `deleteCandidate(id)`
  - `uploadCV(candidateId, file)`
  - `downloadCV(candidateId)`

### 7. Validación

**validation.ts** (`utils/validation.ts`):
- `validateEmail(email)`: Validar formato de email
- `validateRequired(value)`: Validar campo obligatorio
- `validateFile(file)`: Validar tipo y tamaño de archivo
- `validateDateRange(startDate, endDate)`: Validar que endDate >= startDate

### 8. Tipos TypeScript

**index.ts** (`types/index.ts`):
- Definir interfaces para:
  - `Candidate`
  - `Education`
  - `WorkExperience`
  - `LoginCredentials`
  - `ApiResponse<T>`
  - `Pagination`

### 9. Routing

Usar **React Router** (instalar si no está):
- `/login`: Página de login
- `/dashboard`: Dashboard del reclutador
- `/candidates/new`: Formulario para nuevo candidato
- `/candidates/:id/edit`: Formulario para editar candidato (opcional para futuro)

**Protección de rutas**:
- Rutas protegidas requieren autenticación
- Si no está autenticado, redirigir a `/login`

### 10. Manejo de Estado

- Usar **useState** para estado local de formularios
- Usar **AuthContext** para estado de autenticación global
- Manejar estados de loading, error y éxito en cada componente

### 11. UX/UI Requisitos

- **Diseño moderno y limpio**: Usar CSS moderno o considerar una librería de componentes (opcional)
- **Responsive**: Funcionar en móviles, tablets y desktop
- **Accesibilidad**: 
  - Labels asociados a inputs
  - Navegación por teclado
  - Contraste adecuado
  - ARIA labels donde sea necesario
- **Feedback visual**:
  - Loading states en botones durante submit
  - Mensajes de éxito/error claros
  - Validación en tiempo real (opcional)
- **Confirmación**:
  - Después de crear candidato exitosamente, mostrar mensaje de confirmación
  - Opción de volver al dashboard o añadir otro candidato

### 12. Manejo de Errores

- Mostrar mensajes de error amigables al usuario
- Manejar errores de red (conexión perdida)
- Manejar errores de validación del backend
- Mostrar errores específicos por campo cuando sea posible

## Dependencias Necesarias

Instalar las siguientes dependencias:

```bash
npm install react-router-dom @types/react-router-dom
```

Opcional (para mejor UX):
```bash
npm install axios
```

## Estructura de App.tsx

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import CandidateForm from './components/CandidateForm/CandidateForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates/new"
            element={
              <ProtectedRoute>
                <CandidateForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Validaciones del Formulario

1. **Campos obligatorios**:
   - Nombre, Apellido, Email: No pueden estar vacíos
   - En cada educación: Institución y Título
   - En cada experiencia: Empresa y Puesto

2. **Formato de email**: Validar con regex

3. **Fechas**: 
   - Formato válido
   - Fecha fin >= fecha inicio

4. **Archivo CV**:
   - Solo PDF o DOCX
   - Máximo 10MB

5. **Feedback visual**:
   - Mostrar errores debajo de cada campo
   - Deshabilitar botón submit si hay errores
   - Resaltar campos con error

## Estados del Formulario

- **Initial**: Formulario vacío, listo para llenar
- **Filling**: Usuario llenando formulario
- **Validating**: Validando datos antes de enviar
- **Submitting**: Enviando datos al backend (mostrar loading)
- **Success**: Candidato creado exitosamente (mostrar mensaje)
- **Error**: Error al crear (mostrar mensaje de error)

## Mensajes de Confirmación

Después de crear candidato exitosamente:
- Mostrar alerta de éxito: "Candidato añadido exitosamente al sistema"
- Opciones:
  - Botón "Volver al Dashboard"
  - Botón "Añadir Otro Candidato" (limpiar formulario)

## Estilos

- Usar CSS modules o styled-components (opcional)
- O usar CSS global en `App.css`
- Diseño profesional y moderno
- Colores consistentes
- Espaciado adecuado
- Tipografía legible

## Archivos a Crear/Modificar

- `frontend/src/App.tsx` (modificar completamente)
- `frontend/src/components/Login/Login.tsx` (crear)
- `frontend/src/components/Dashboard/Dashboard.tsx` (crear)
- `frontend/src/components/CandidateForm/CandidateForm.tsx` (crear)
- `frontend/src/components/CandidateForm/EducationSection.tsx` (crear)
- `frontend/src/components/CandidateForm/WorkExperienceSection.tsx` (crear)
- `frontend/src/components/CandidateForm/FileUpload.tsx` (crear)
- `frontend/src/components/common/Button.tsx` (crear)
- `frontend/src/components/common/Input.tsx` (crear)
- `frontend/src/components/common/Alert.tsx` (crear)
- `frontend/src/components/common/LoadingSpinner.tsx` (crear)
- `frontend/src/components/common/ProtectedRoute.tsx` (crear)
- `frontend/src/services/api.ts` (crear)
- `frontend/src/context/AuthContext.tsx` (crear)
- `frontend/src/hooks/useAuth.ts` (crear)
- `frontend/src/types/index.ts` (crear)
- `frontend/src/utils/validation.ts` (crear)
- `frontend/src/App.css` (modificar/crear estilos)

## Notas Importantes

1. **Autenticación Mock**: El login debe funcionar con cualquier credencial
2. **Token**: Guardar token en localStorage, agregarlo a headers de requests
3. **CORS**: El backend debe estar configurado para aceptar requests desde `http://localhost:3000`
4. **Manejo de archivos**: Usar FormData para enviar archivos
5. **TypeScript**: Usar tipos estrictos, evitar `any`
6. **Responsive**: Probar en diferentes tamaños de pantalla
7. **Accesibilidad**: Seguir buenas prácticas de accesibilidad web

## Flujo Completo

1. Usuario abre la app → Redirige a `/login` si no está autenticado
2. Usuario ingresa cualquier credencial → Login exitoso → Token guardado → Redirige a `/dashboard`
3. Usuario ve dashboard → Click en "Añadir Nuevo Candidato" → Va a `/candidates/new`
4. Usuario llena formulario → Valida datos → Submit
5. Backend procesa → Respuesta exitosa → Muestra confirmación
6. Usuario puede volver al dashboard o añadir otro candidato

