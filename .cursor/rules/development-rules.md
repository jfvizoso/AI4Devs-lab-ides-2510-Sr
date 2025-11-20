# Reglas de Desarrollo - LTI Talent Tracking System

Este documento establece las reglas y convenciones de desarrollo para el proyecto LTI Talent Tracking System.

## TypeScript

### Configuración General
- **Versión**: 4.9.5 (tanto frontend como backend)
- **Modo strict**: Habilitado en ambos proyectos
- **Type checking**: Siempre verificar tipos antes de commit

### Reglas de Código
- ✅ **SIEMPRE** usar tipos explícitos en funciones públicas y exports
- ✅ **SIEMPRE** evitar `any` - usar `unknown` si es necesario y hacer type guards
- ✅ **SIEMPRE** usar interfaces para objetos y tipos para uniones/primitivos
- ✅ **SIEMPRE** definir tipos para props de componentes React
- ✅ **SIEMPRE** tipar respuestas de API y modelos de datos
- ❌ **NUNCA** usar `@ts-ignore` o `@ts-expect-error` sin comentario explicativo
- ❌ **NUNCA** dejar variables sin tipo cuando el tipo no es obvio

### Ejemplos

```typescript
// ✅ CORRECTO
interface User {
  id: number;
  email: string;
  name: string | null;
}

function getUser(id: number): Promise<User> {
  // ...
}

// ❌ INCORRECTO
function getUser(id: any): any {
  // ...
}
```

## React (Frontend)

### Componentes
- ✅ **SIEMPRE** usar Functional Components con Hooks
- ✅ **SIEMPRE** usar TypeScript para props con interfaces
- ✅ **SIEMPRE** nombrar componentes en PascalCase
- ✅ **SIEMPRE** exportar componentes como default o named exports consistentemente
- ✅ **SIEMPRE** usar hooks de React (useState, useEffect, etc.) en lugar de clases
- ❌ **NUNCA** usar Class Components
- ❌ **NUNCA** mutar props directamente

### Estructura de Componentes
```typescript
// ✅ CORRECTO
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
```

### Hooks
- ✅ **SIEMPRE** seguir las reglas de Hooks (solo en nivel superior)
- ✅ **SIEMPRE** incluir dependencias correctas en useEffect
- ✅ **SIEMPRE** limpiar efectos (cleanup) cuando sea necesario
- ✅ **SIEMPRE** usar hooks personalizados para lógica reutilizable

### Estado
- ✅ **SIEMPRE** usar useState para estado local simple
- ✅ **SIEMPRE** considerar Context API para estado compartido
- ✅ **SIEMPRE** evitar prop drilling excesivo

### Performance
- ✅ **SIEMPRE** usar React.memo para componentes que se re-renderizan frecuentemente
- ✅ **SIEMPRE** usar useMemo y useCallback cuando sea apropiado
- ✅ **SIEMPRE** evitar crear funciones/objetos en el render

## Express (Backend)

### Estructura de Rutas
- ✅ **SIEMPRE** organizar rutas en módulos separados
- ✅ **SIEMPRE** usar controladores separados de las rutas
- ✅ **SIEMPRE** validar entrada de datos antes de procesar
- ✅ **SIEMPRE** manejar errores apropiadamente
- ❌ **NUNCA** poner lógica de negocio directamente en las rutas

### Estructura Recomendada
```
backend/src/
  ├── routes/
  │   └── users.routes.ts
  ├── controllers/
  │   └── users.controller.ts
  ├── services/
  │   └── users.service.ts
  ├── middleware/
  │   └── auth.middleware.ts
  └── index.ts
```

### Manejo de Errores
- ✅ **SIEMPRE** usar middleware de error centralizado
- ✅ **SIEMPRE** retornar códigos HTTP apropiados
- ✅ **SIEMPRE** incluir mensajes de error descriptivos en desarrollo
- ✅ **SIEMPRE** no exponer detalles internos en producción

```typescript
// ✅ CORRECTO
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

### Respuestas API
- ✅ **SIEMPRE** usar JSON para respuestas
- ✅ **SIEMPRE** mantener formato consistente de respuestas
- ✅ **SIEMPRE** usar códigos HTTP apropiados (200, 201, 400, 401, 404, 500)

```typescript
// ✅ CORRECTO - Formato consistente
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Para errores
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Prisma

### Schema
- ✅ **SIEMPRE** definir relaciones explícitamente en el schema
- ✅ **SIEMPRE** usar nombres descriptivos para modelos y campos
- ✅ **SIEMPRE** usar tipos apropiados (String, Int, DateTime, etc.)
- ✅ **SIEMPRE** agregar índices para campos de búsqueda frecuente
- ✅ **SIEMPRE** usar `@default` para valores por defecto cuando sea apropiado
- ❌ **NUNCA** modificar migraciones manualmente después de aplicarlas

### Migraciones
- ✅ **SIEMPRE** crear migraciones para cambios de schema: `npx prisma migrate dev --name nombre_migracion`
- ✅ **SIEMPRE** revisar migraciones antes de aplicarlas
- ✅ **SIEMPRE** generar Prisma Client después de cambios: `npm run prisma:generate`
- ❌ **NUNCA** hacer cambios directos en la base de datos sin migraciones

### Queries
- ✅ **SIEMPRE** usar Prisma Client tipado
- ✅ **SIEMPRE** manejar errores de Prisma apropiadamente
- ✅ **SIEMPRE** usar transacciones para operaciones múltiples relacionadas
- ✅ **SIEMPRE** incluir solo campos necesarios (select) cuando sea posible
- ❌ **NUNCA** hacer queries N+1 - usar `include` o `select` apropiadamente

```typescript
// ✅ CORRECTO
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true
  }
});

// ❌ INCORRECTO - Query N+1
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
}
```

## Testing

### Backend (Jest + Supertest)
- ✅ **SIEMPRE** escribir tests para endpoints críticos
- ✅ **SIEMPRE** usar describe/it para organizar tests
- ✅ **SIEMPRE** limpiar datos de test después de cada test
- ✅ **SIEMPRE** usar nombres descriptivos para tests
- ✅ **SIEMPRE** testear casos de éxito y error

```typescript
// ✅ CORRECTO
describe('GET /api/users/:id', () => {
  it('should return user when id exists', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(1);
  });

  it('should return 404 when user does not exist', async () => {
    await request(app)
      .get('/api/users/999')
      .expect(404);
  });
});
```

### Frontend (Jest + React Testing Library)
- ✅ **SIEMPRE** testear comportamiento, no implementación
- ✅ **SIEMPRE** usar queries accesibles (getByRole, getByLabelText, etc.)
- ✅ **SIEMPRE** simular interacciones de usuario con user-event
- ✅ **SIEMPRE** limpiar después de cada test

```typescript
// ✅ CORRECTO
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button label="Click me" onClick={handleClick} />);
  
  const button = screen.getByRole('button', { name: /click me/i });
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Convenciones de Naming

### Archivos y Directorios
- ✅ **Componentes React**: PascalCase (`UserProfile.tsx`)
- ✅ **Utilidades/Helpers**: camelCase (`formatDate.ts`, `apiClient.ts`)
- ✅ **Hooks personalizados**: camelCase con prefijo `use` (`useAuth.ts`)
- ✅ **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- ✅ **Tipos/Interfaces**: PascalCase (`User`, `ApiResponse`)
- ✅ **Rutas backend**: kebab-case o camelCase (`users.routes.ts`)

### Variables y Funciones
- ✅ **Variables**: camelCase (`userName`, `isLoading`)
- ✅ **Funciones**: camelCase (`getUserById`, `handleSubmit`)
- ✅ **Componentes**: PascalCase (`UserCard`, `LoginForm`)
- ✅ **Clases**: PascalCase (`UserService`, `AuthMiddleware`)
- ✅ **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_TIMEOUT`)
- ✅ **Booleans**: prefijo `is`, `has`, `should` (`isActive`, `hasPermission`)

### Base de Datos
- ✅ **Modelos Prisma**: PascalCase singular (`User`, `UserProfile`)
- ✅ **Campos**: camelCase (`firstName`, `createdAt`)
- ✅ **Tablas**: snake_case o camelCase (Prisma maneja esto automáticamente)

## Estructura de Código

### Frontend
```
frontend/src/
  ├── components/        # Componentes reutilizables
  │   ├── common/       # Componentes comunes (Button, Input, etc.)
  │   └── features/     # Componentes específicos de features
  ├── pages/            # Páginas/Views
  ├── hooks/            # Custom hooks
  ├── services/         # Servicios API
  ├── utils/            # Utilidades
  ├── types/            # Tipos TypeScript
  └── App.tsx
```

### Backend
```
backend/src/
  ├── routes/           # Definición de rutas
  ├── controllers/      # Lógica de controladores
  ├── services/         # Lógica de negocio
  ├── middleware/       # Middlewares
  ├── types/            # Tipos TypeScript
  ├── utils/            # Utilidades
  └── index.ts          # Entry point
```

## Imports y Exports

### Imports
- ✅ **SIEMPRE** organizar imports: externos → internos → relativos
- ✅ **SIEMPRE** usar imports absolutos cuando sea posible
- ✅ **SIEMPRE** agrupar imports relacionados

```typescript
// ✅ CORRECTO
import React, { useState, useEffect } from 'react';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { UserService } from '../services/user.service';
import { validateEmail } from '../utils/validation';
```

### Exports
- ✅ **SIEMPRE** usar named exports para utilidades y funciones
- ✅ **SIEMPRE** usar default exports para componentes React
- ✅ **SIEMPRE** ser consistente en el proyecto

## Manejo de Errores

### Frontend
- ✅ **SIEMPRE** manejar errores de API con try/catch
- ✅ **SIEMPRE** mostrar mensajes de error amigables al usuario
- ✅ **SIEMPRE** loguear errores para debugging
- ✅ **SIEMPRE** usar estados de error en componentes

```typescript
// ✅ CORRECTO
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchUserData();
  setUserData(data);
} catch (err) {
  setError('No se pudo cargar la información del usuario');
  console.error('Error fetching user:', err);
}
```

### Backend
- ✅ **SIEMPRE** usar try/catch en funciones async
- ✅ **SIEMPRE** retornar códigos HTTP apropiados
- ✅ **SIEMPRE** loguear errores para debugging
- ✅ **SIEMPRE** no exponer detalles sensibles en producción

## Variables de Entorno

- ✅ **SIEMPRE** usar variables de entorno para configuración sensible
- ✅ **SIEMPRE** documentar variables requeridas en README
- ✅ **SIEMPRE** usar `.env.example` como plantilla
- ✅ **SIEMPRE** nunca commitear `.env` con datos reales
- ✅ **SIEMPRE** usar prefijo `REACT_APP_` para variables del frontend

## Git y Commits

- ✅ **SIEMPRE** hacer commits pequeños y frecuentes
- ✅ **SIEMPRE** usar mensajes descriptivos
- ✅ **SIEMPRE** verificar que los tests pasen antes de commitear
- ✅ **SIEMPRE** formatear código con Prettier antes de commitear

### Formato de Commits
```
tipo(scope): descripción breve

Descripción detallada si es necesario

Ejemplos:
feat(backend): add user authentication endpoint
fix(frontend): correct button styling in UserCard
refactor(prisma): update User model schema
test(backend): add tests for user routes
```

## Code Quality

### Linting
- ✅ **SIEMPRE** correr ESLint antes de commitear
- ✅ **SIEMPRE** corregir warnings de ESLint
- ✅ **SIEMPRE** mantener configuración consistente de ESLint

### Formatting
- ✅ **SIEMPRE** usar Prettier para formateo automático
- ✅ **SIEMPRE** mantener configuración consistente de Prettier
- ✅ **SIEMPRE** formatear código antes de commitear

### Type Checking
- ✅ **SIEMPRE** verificar que TypeScript compile sin errores
- ✅ **SIEMPRE** corregir errores de tipo antes de commitear
- ❌ **NUNCA** usar `any` como solución rápida

## Performance

### Frontend
- ✅ **SIEMPRE** optimizar imágenes y assets
- ✅ **SIEMPRE** usar lazy loading para componentes pesados
- ✅ **SIEMPRE** evitar re-renders innecesarios
- ✅ **SIEMPRE** usar React.memo, useMemo, useCallback apropiadamente

### Backend
- ✅ **SIEMPRE** optimizar queries de base de datos
- ✅ **SIEMPRE** usar índices apropiados
- ✅ **SIEMPRE** evitar queries N+1
- ✅ **SIEMPRE** usar paginación para listas grandes

## Seguridad

- ✅ **SIEMPRE** validar y sanitizar entrada de usuario
- ✅ **SIEMPRE** usar parámetros preparados en queries (Prisma lo hace automáticamente)
- ✅ **SIEMPRE** no exponer información sensible en respuestas
- ✅ **SIEMPRE** usar HTTPS en producción
- ✅ **SIEMPRE** implementar autenticación y autorización apropiadas
- ❌ **NUNCA** almacenar passwords en texto plano
- ❌ **NUNCA** exponer secrets en código o logs

## Documentación

- ✅ **SIEMPRE** documentar funciones complejas
- ✅ **SIEMPRE** documentar APIs con Swagger (cuando esté implementado)
- ✅ **SIEMPRE** mantener README actualizado
- ✅ **SIEMPRE** documentar decisiones arquitectónicas importantes

```typescript
// ✅ CORRECTO
/**
 * Obtiene un usuario por su ID
 * @param userId - ID del usuario a buscar
 * @returns Promise con el usuario o null si no existe
 * @throws {Error} Si hay un error de conexión a la base de datos
 */
async function getUserById(userId: number): Promise<User | null> {
  // ...
}
```

## Resumen de Reglas Críticas

1. ✅ **TypeScript strict mode** - siempre habilitado
2. ✅ **No usar `any`** - usar tipos apropiados
3. ✅ **Functional Components** - solo en React
4. ✅ **Separación de responsabilidades** - routes, controllers, services
5. ✅ **Manejo de errores** - siempre implementar
6. ✅ **Testing** - escribir tests para código crítico
7. ✅ **Validación** - siempre validar entrada
8. ✅ **Seguridad** - nunca exponer información sensible
9. ✅ **Performance** - optimizar queries y renders
10. ✅ **Documentación** - mantener código documentado

---

**Nota**: Estas reglas deben seguirse consistentemente en todo el proyecto. Si hay excepciones necesarias, deben documentarse y justificarse.

