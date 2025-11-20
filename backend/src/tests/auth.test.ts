import request from 'supertest';
import { app } from '../index';

describe('POST /api/auth/login', () => {
  it('should accept any credentials and return a mock token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'anyuser',
        password: 'anypassword'
      })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Login exitoso');
    expect(response.body.data).toHaveProperty('token', 'mock-token-123');
  });

  it('should accept empty credentials and return a mock token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: '',
        password: ''
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBe('mock-token-123');
  });

  it('should accept missing credentials and return a mock token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBe('mock-token-123');
  });

  it('should return JSON format', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test',
        password: 'test'
      })
      .expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
  });
});

describe('POST /api/auth/logout', () => {
  it('should return success message', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Logout exitoso');
  });

  it('should return JSON format', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
  });
});

