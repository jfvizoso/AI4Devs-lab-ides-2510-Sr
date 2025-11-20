import request from 'supertest';
import { app } from '../index';
import prisma from '../index';

const MOCK_TOKEN = 'mock-token-123';

// Helper para obtener token de autenticación
const getAuthToken = async (): Promise<string> => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ username: 'test', password: 'test' });
  return loginResponse.body.data.token;
};

describe('POST /api/candidates', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  afterEach(async () => {
    // Limpiar candidatos creados en los tests
    await prisma.candidate.deleteMany({
      where: {
        email: {
          contains: 'test@'
        }
      }
    });
  });

  it('should create a candidate with minimal required fields', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.candidate).toHaveProperty('id');
    expect(response.body.data.candidate.firstName).toBe(candidateData.firstName);
    expect(response.body.data.candidate.lastName).toBe(candidateData.lastName);
    expect(response.body.data.candidate.email).toBe(candidateData.email);
    expect(response.body.data.education).toEqual([]);
    expect(response.body.data.workExperience).toEqual([]);
  });

  it('should create a candidate with all fields', async () => {
    const candidateData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'test2@example.com',
      phone: '123456789',
      address: '123 Main St',
      education: [
        {
          institution: 'University Test',
          degree: 'Bachelor',
          fieldOfStudy: 'Computer Science',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          isCurrent: false
        }
      ],
      workExperience: [
        {
          company: 'Tech Corp',
          position: 'Developer',
          description: 'Software development',
          startDate: '2024-02-01',
          isCurrent: true
        }
      ]
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.candidate.firstName).toBe(candidateData.firstName);
    expect(response.body.data.candidate.phone).toBe(candidateData.phone);
    expect(response.body.data.candidate.address).toBe(candidateData.address);
    expect(response.body.data.education).toHaveLength(1);
    expect(response.body.data.workExperience).toHaveLength(1);
  });

  it('should return 400 if firstName is missing', async () => {
    const candidateData = {
      lastName: 'Doe',
      email: 'test3@example.com'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Nombre');
  });

  it('should return 400 if lastName is missing', async () => {
    const candidateData = {
      firstName: 'John',
      email: 'test4@example.com'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Apellido');
  });

  it('should return 400 if email is missing', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('email');
  });

  it('should return 400 if email format is invalid', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('email');
  });

  it('should return 400 if firstName is too short', async () => {
    const candidateData = {
      firstName: 'J',
      lastName: 'Doe',
      email: 'test5@example.com'
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('al menos 2 caracteres');
  });

  it('should return 409 if email already exists', async () => {
    // Crear candidato primero
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'duplicate@example.com'
    };

    await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(201);

    // Intentar crear otro con el mismo email
    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('ya está registrado');
  });

  it('should return 401 if no token is provided', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test6@example.com'
    };

    const response = await request(app)
      .post('/api/candidates')
      .send(candidateData)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Token');
  });

  it('should return 400 if endDate is before startDate in education', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test7@example.com',
      education: [
        {
          institution: 'University',
          degree: 'Bachelor',
          startDate: '2024-01-01',
          endDate: '2020-01-01' // Fecha fin antes de inicio
        }
      ]
    };

    const response = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .send(candidateData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('fecha de fin');
  });
});

describe('GET /api/candidates', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken();
    // Crear algunos candidatos de prueba
    await prisma.candidate.createMany({
      data: [
        {
          firstName: 'Test1',
          lastName: 'User1',
          email: 'testuser1@example.com'
        },
        {
          firstName: 'Test2',
          lastName: 'User2',
          email: 'testuser2@example.com'
        },
        {
          firstName: 'Test3',
          lastName: 'User3',
          email: 'testuser3@example.com'
        }
      ]
    });
  });

  afterAll(async () => {
    await prisma.candidate.deleteMany({
      where: {
        email: {
          contains: 'testuser'
        }
      }
    });
  });

  it('should return paginated list of candidates', async () => {
    const response = await request(app)
      .get('/api/candidates')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('candidates');
    expect(response.body.data).toHaveProperty('pagination');
    expect(response.body.data.pagination).toHaveProperty('page');
    expect(response.body.data.pagination).toHaveProperty('limit');
    expect(response.body.data.pagination).toHaveProperty('total');
    expect(response.body.data.pagination).toHaveProperty('totalPages');
  });

  it('should respect page and limit query parameters', async () => {
    const response = await request(app)
      .get('/api/candidates?page=1&limit=2')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.pagination.limit).toBe(2);
    expect(response.body.data.candidates.length).toBeLessThanOrEqual(2);
  });

  it('should return 401 if no token is provided', async () => {
    await request(app)
      .get('/api/candidates')
      .expect(401);
  });
});

describe('GET /api/candidates/:id', () => {
  let authToken: string;
  let candidateId: number;

  beforeAll(async () => {
    authToken = await getAuthToken();
    // Crear un candidato de prueba
    const candidate = await prisma.candidate.create({
      data: {
        firstName: 'GetTest',
        lastName: 'User',
        email: 'gettest@example.com',
        education: {
          create: {
            institution: 'Test University',
            degree: 'Test Degree'
          }
        },
        workExperience: {
          create: {
            company: 'Test Company',
            position: 'Test Position'
          }
        }
      }
    });
    candidateId = candidate.id;
  });

  afterAll(async () => {
    await prisma.candidate.delete({
      where: { id: candidateId }
    });
  });

  it('should return candidate by id with relations', async () => {
    const response = await request(app)
      .get(`/api/candidates/${candidateId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.candidate.id).toBe(candidateId);
    expect(response.body.data.candidate.firstName).toBe('GetTest');
    expect(response.body.data.education).toHaveLength(1);
    expect(response.body.data.workExperience).toHaveLength(1);
  });

  it('should return 404 if candidate does not exist', async () => {
    const response = await request(app)
      .get('/api/candidates/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('no encontrado');
  });

  it('should return 400 if id is invalid', async () => {
    const response = await request(app)
      .get('/api/candidates/invalid')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should return 401 if no token is provided', async () => {
    await request(app)
      .get(`/api/candidates/${candidateId}`)
      .expect(401);
  });
});

describe('PUT /api/candidates/:id', () => {
  let authToken: string;
  let candidateId: number;

  beforeEach(async () => {
    authToken = await getAuthToken();
    const candidate = await prisma.candidate.create({
      data: {
        firstName: 'UpdateTest',
        lastName: 'User',
        email: `updatetest${Date.now()}@example.com`
      }
    });
    candidateId = candidate.id;
  });

  afterEach(async () => {
    await prisma.candidate.delete({
      where: { id: candidateId }
    }).catch(() => {});
  });

  it('should update candidate fields', async () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
      phone: '987654321'
    };

    const response = await request(app)
      .put(`/api/candidates/${candidateId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.candidate.firstName).toBe(updateData.firstName);
    expect(response.body.data.candidate.lastName).toBe(updateData.lastName);
    expect(response.body.data.candidate.phone).toBe(updateData.phone);
  });

  it('should return 404 if candidate does not exist', async () => {
    const response = await request(app)
      .put('/api/candidates/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ firstName: 'Test' })
      .expect(404);

    expect(response.body.success).toBe(false);
  });

  it('should return 401 if no token is provided', async () => {
    await request(app)
      .put(`/api/candidates/${candidateId}`)
      .send({ firstName: 'Test' })
      .expect(401);
  });
});

describe('DELETE /api/candidates/:id', () => {
  let authToken: string;
  let candidateId: number;

  beforeEach(async () => {
    authToken = await getAuthToken();
    const candidate = await prisma.candidate.create({
      data: {
        firstName: 'DeleteTest',
        lastName: 'User',
        email: `deletetest${Date.now()}@example.com`
      }
    });
    candidateId = candidate.id;
  });

  it('should delete candidate successfully', async () => {
    const response = await request(app)
      .delete(`/api/candidates/${candidateId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('eliminado');

    // Verificar que el candidato fue eliminado
    const deleted = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });
    expect(deleted).toBeNull();
  });

  it('should return 404 if candidate does not exist', async () => {
    const response = await request(app)
      .delete('/api/candidates/99999')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body.success).toBe(false);
  });

  it('should return 401 if no token is provided', async () => {
    await request(app)
      .delete(`/api/candidates/${candidateId}`)
      .expect(401);
  });
});

