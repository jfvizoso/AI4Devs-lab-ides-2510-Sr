import request from 'supertest';
import { app } from '../index';

describe('Authentication Middleware', () => {
  it('should allow access with valid token', async () => {
    // Obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' });

    const token = loginResponse.body.data.token;

    // Intentar acceder a endpoint protegido
    const response = await request(app)
      .get('/api/candidates')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  it('should reject access without token', async () => {
    const response = await request(app)
      .get('/api/candidates')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Token');
  });

  it('should reject access with invalid token format', async () => {
    const response = await request(app)
      .get('/api/candidates')
      .set('Authorization', 'InvalidFormat token')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should reject access with empty token', async () => {
    const response = await request(app)
      .get('/api/candidates')
      .set('Authorization', 'Bearer ')
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should accept any token value (mock behavior)', async () => {
    const response = await request(app)
      .get('/api/candidates')
      .set('Authorization', 'Bearer any-random-token-value')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});

describe('Error Middleware', () => {
  it('should handle 404 errors properly', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    // El error middleware debería formatear la respuesta
    expect(response.body).toHaveProperty('success');
  });

  it('should format error responses consistently', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', 'Bearer mock-token-123')
      .send({}) // Datos inválidos
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });
});

