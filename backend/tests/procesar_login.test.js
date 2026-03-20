const request = require('supertest');
const app = require('../src/server');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('debe retornar 400 si el correo ya existe', async () => {
      // Primer registro
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@uni.edu',
        university: 'Universidad Test',
        password: 'password123',
      });

      // Segundo registro con el mismo correo
      const res = await request(app).post('/api/auth/register').send({
        name: 'Otro User',
        email: 'test@uni.edu',
        university: 'Universidad Test',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBeDefined();
    });

    it('debe registrar usuario correctamente', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Nuevo Usuario',
        email: `nuevo_${Date.now()}@uni.edu`,
        university: 'Universidad Nacional',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe retornar 401 con credenciales incorrectas', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'noexiste@uni.edu',
        password: 'wrongpassword',
      });
      expect(res.statusCode).toBe(401);
    });
  });
});
