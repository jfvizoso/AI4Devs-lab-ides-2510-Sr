# Active Context - LTI Talent Tracking System

## Estado Actual

El proyecto está en **fase inicial** (v0.0.0.001) con la estructura base implementada. Se está trabajando en el "Primer ticket del proyecto LTI".

## Trabajo Actual

### Enfoque Inmediato

- **Inicialización del Memory Bank**: Estableciendo la documentación base del proyecto
- **Estructura base**: Frontend y backend configurados y funcionando básicamente
- **Preparación para desarrollo**: Sistema listo para comenzar implementación de features

### Cambios Recientes

- Estructura del proyecto creada
- Backend Express básico implementado
- Frontend React inicial configurado
- Prisma schema con modelo User básico
- Docker Compose configurado para PostgreSQL
- Tests básicos configurados

## Próximos Pasos

1. **Resolver discrepancia en tests**: 
   - Test espera "Hello World!" pero código devuelve "Hola LTI!"
   - Decidir mensaje correcto y actualizar

2. **Implementar primer ticket**:
   - Revisar requisitos del ticket
   - Planificar implementación
   - Ejecutar desarrollo

3. **Estructura de API**:
   - Definir rutas y controladores
   - Implementar endpoints básicos
   - Configurar Swagger

4. **Autenticación**:
   - Sistema de login
   - JWT tokens
   - Middleware de autenticación

5. **Frontend básico**:
   - Componentes principales
   - Conexión con backend
   - Manejo de estado

## Decisiones Activas

### Pendientes de Decisión

- **Mensaje de bienvenida**: ¿"Hola LTI!" o "Hello World!"?
- **Estructura de carpetas backend**: ¿MVC completo o estructura más simple inicialmente?
- **Estado frontend**: ¿Context API, Redux, o estado local inicialmente?
- **Validación**: ¿Zod, Yup, o validación manual?

### Decisiones Tomadas

- ✅ TypeScript en frontend y backend
- ✅ Prisma como ORM
- ✅ PostgreSQL como base de datos
- ✅ Docker para base de datos
- ✅ Jest para testing
- ✅ Separación clara frontend/backend

## Consideraciones Actuales

### Issues Conocidos

1. **Test desactualizado**: El test en `backend/src/tests/app.test.ts` espera "Hello World!" pero el código devuelve "Hola LTI!"
2. **Schema básico**: Solo modelo User con campos mínimos
3. **Sin autenticación**: Sistema abierto, sin seguridad implementada
4. **Sin validación**: No hay validación de datos en endpoints
5. **Swagger no implementado**: Configurado pero no en uso

### Prioridades

1. **Alta**: Resolver discrepancia test/código
2. **Alta**: Implementar primer ticket del proyecto
3. **Media**: Estructurar API backend
4. **Media**: Conectar frontend con backend
5. **Baja**: Documentación Swagger
6. **Baja**: Mejoras de UI

## Contexto del Entorno

- **Branch**: main
- **Versión**: 0.0.0.001
- **Estado Git**: Limpio (solo .cursor/ sin trackear)
- **Ambiente**: Desarrollo local

## Notas de Desarrollo

- El proyecto está listo para comenzar desarrollo activo
- La estructura base permite escalar fácilmente
- Se recomienda mantener documentación actualizada
- Tests deben mantenerse actualizados con el código

