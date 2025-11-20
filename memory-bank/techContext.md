# Tech Context - LTI Talent Tracking System

## Stack Tecnológico

### Frontend

- **Framework**: React 18.3.1
- **Lenguaje**: TypeScript 4.9.5
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Testing**: 
  - Jest
  - React Testing Library
  - @testing-library/user-event

### Backend

- **Runtime**: Node.js
- **Framework**: Express 4.19.2
- **Lenguaje**: TypeScript 4.9.5
- **ORM**: Prisma 5.13.0
- **Database Client**: @prisma/client 5.13.0
- **Testing**: 
  - Jest 29.7.0
  - Supertest 7.0.0
  - ts-jest 29.1.2
- **Documentación API**: 
  - swagger-jsdoc 6.2.8
  - swagger-ui-express 5.0.0 (configurado pero no implementado)

### Base de Datos

- **Database**: PostgreSQL
- **Containerización**: Docker
- **ORM**: Prisma

### Herramientas de Desarrollo

- **Linting**: ESLint 9.2.0
- **Formatting**: Prettier 3.2.5
- **Type Checking**: TypeScript
- **Dev Server**: 
  - Backend: ts-node-dev 1.1.6
  - Frontend: react-scripts (webpack dev server)

## Configuración de Desarrollo

### Puertos

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3010
- **PostgreSQL**: localhost:5432

### Base de Datos (Docker)

```yaml
User: LTIdbUser
Password: D1ymf8wyQEGthFR1E9xhCq
Database: LTIdb
Port: 5432
```

### Variables de Entorno

- Backend requiere `.env` con `DATABASE_URL`
- Frontend puede usar variables de entorno con prefijo `REACT_APP_`

## Dependencias Clave

### Backend Dependencies
- `express`: Framework web
- `@prisma/client`: Cliente de base de datos
- `dotenv`: Gestión de variables de entorno
- `swagger-jsdoc` / `swagger-ui-express`: Documentación API

### Backend DevDependencies
- `typescript`: Compilador TypeScript
- `ts-node-dev`: Hot reload para desarrollo
- `jest` / `ts-jest`: Framework de testing
- `supertest`: Testing de HTTP
- `eslint` / `prettier`: Code quality

### Frontend Dependencies
- `react` / `react-dom`: Biblioteca UI
- `react-scripts`: Herramientas de build
- `typescript`: Type safety

## Scripts Disponibles

### Backend
- `npm run dev`: Desarrollo con hot reload
- `npm run build`: Compilar TypeScript
- `npm start`: Ejecutar producción
- `npm test`: Ejecutar tests
- `npm run prisma:generate`: Generar Prisma Client
- `npm run start:prod`: Build + start producción

### Frontend
- `npm start`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm test`: Ejecutar tests

## Configuración TypeScript

- **Backend**: `tsconfig.json` configurado para Node.js
- **Frontend**: TypeScript configurado por react-scripts
- Ambos usan TypeScript 4.9.5

## Restricciones Técnicas

- Node.js version (verificar compatibilidad)
- PostgreSQL debe estar corriendo (Docker)
- TypeScript strict mode
- No se usa eject en Create React App (mantener react-scripts)

## Setup de Desarrollo

1. Instalar dependencias: `npm install` en frontend y backend
2. Iniciar Docker: `docker-compose up -d`
3. Generar Prisma Client: `npm run prisma:generate` en backend
4. Ejecutar migraciones (cuando existan)
5. Iniciar backend: `npm run dev` en backend
6. Iniciar frontend: `npm start` en frontend

## Consideraciones de Producción

- Build de frontend genera carpeta `build/`
- Backend compila a `dist/`
- Variables de entorno deben configurarse en producción
- Base de datos debe estar accesible desde backend
- CORS debe configurarse si frontend y backend están en diferentes dominios

