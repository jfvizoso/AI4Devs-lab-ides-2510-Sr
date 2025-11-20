# System Patterns - LTI Talent Tracking System

## Arquitectura del Sistema

### Estructura General

El sistema sigue una arquitectura de separación de responsabilidades con frontend y backend independientes:

```
┌─────────────┐
│   Frontend  │  React + TypeScript
│  (Port 3000)│
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │  Express + TypeScript
│ (Port 3010) │
└──────┬──────┘
       │ Prisma ORM
       │
┌──────▼──────┐
│  PostgreSQL │  Docker Container
│  (Port 5432)│
└─────────────┘
```

## Patrones de Diseño

### Backend

1. **MVC Pattern** (implícito):
   - Modelos: Prisma Schema
   - Controladores: Express routes (pendiente de estructura)
   - Vistas: JSON responses

2. **Middleware Pattern**:
   - Error handling middleware implementado
   - Preparado para autenticación middleware

3. **Dependency Injection**:
   - Prisma Client exportado como módulo
   - Express app exportado para testing

### Frontend

1. **Component-based Architecture**:
   - React components como unidades de UI
   - Separación de lógica y presentación

2. **Functional Components**:
   - Uso de React hooks (preparado para implementación)

## Decisiones Técnicas Clave

### Base de Datos

- **ORM**: Prisma para type-safety y migraciones
- **Database**: PostgreSQL para robustez y características avanzadas
- **Containerización**: Docker para consistencia de entorno

### API Design

- **RESTful**: Preparado para seguir convenciones REST
- **JSON**: Formato de intercambio de datos
- **Error Handling**: Middleware centralizado para errores

### Testing

- **Backend**: Jest + Supertest para testing de API
- **Frontend**: Jest + React Testing Library
- **Estructura**: Tests separados en directorio `tests/`

## Relaciones entre Componentes

### Backend → Database
- Prisma Client maneja todas las conexiones
- Schema define la estructura de datos
- Migrations para versionado de schema

### Frontend → Backend
- Llamadas HTTP (fetch/axios - pendiente de implementar)
- Comunicación asíncrona
- Manejo de estados de carga y error

## Convenciones de Código

### Naming
- TypeScript strict mode
- CamelCase para variables y funciones
- PascalCase para componentes y clases

### Estructura de Archivos
- Separación frontend/backend
- `src/` para código fuente
- `tests/` para tests
- `prisma/` para schema y migraciones

## Extensiones Futuras

- Autenticación JWT
- Validación de datos (Zod/Yup)
- Logging estructurado
- Documentación API (Swagger configurado pero no implementado)
- Caching layer
- Rate limiting

