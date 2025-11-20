# Tests del Backend

Este directorio contiene los tests unitarios e integración para el backend del sistema LTI.

## Estructura de Tests

- `app.test.ts` - Tests básicos de la aplicación
- `auth.test.ts` - Tests de autenticación (login, logout)
- `candidates.test.ts` - Tests CRUD de candidatos
- `middleware.test.ts` - Tests de middleware (autenticación, errores)
- `validation.test.ts` - Tests de funciones de validación
- `setup.ts` - Configuración global para tests

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar un archivo específico
npm test -- auth.test.ts
```

## Buenas Prácticas Aplicadas

### 1. Organización
- Tests agrupados por funcionalidad usando `describe`
- Nombres descriptivos para tests (`it('should ...')`)
- Separación clara entre setup, ejecución y aserciones

### 2. Aislamiento
- Cada test es independiente
- Limpieza de datos después de cada test (`afterEach`, `afterAll`)
- Uso de `beforeEach` y `beforeAll` para setup

### 3. Cobertura
- Tests de casos de éxito
- Tests de casos de error (400, 401, 404, 409)
- Tests de validación
- Tests de middleware

### 4. Aserciones
- Verificación de status codes HTTP
- Verificación de estructura de respuestas JSON
- Verificación de datos específicos
- Verificación de mensajes de error

### 5. Manejo de Datos
- Uso de emails únicos con timestamps para evitar conflictos
- Limpieza automática de datos de test
- Uso de helpers para operaciones comunes (getAuthToken)

## Requisitos

- Base de datos PostgreSQL corriendo (Docker)
- Variables de entorno configuradas (.env)
- Prisma Client generado (`npm run prisma:generate`)

## Notas

- Los tests interactúan con la base de datos real (no mocks)
- Se recomienda usar una base de datos de test separada en producción
- Los tests tienen un timeout de 10 segundos para operaciones de BD
- La autenticación es mock (acepta cualquier credencial)

