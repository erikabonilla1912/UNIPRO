const request = require('supertest');
const app = require('../src/server');

describe('Proyectos API', () => {
  describe('GET /api/proyectos', () => {
    it('debe retornar lista de proyectos', async () => {
      const res = await request(app).get('/api/proyectos');
      expect(res.statusCode).toBe(200);
      expect(res.body.projects).toBeDefined();
      expect(Array.isArray(res.body.projects)).toBe(true);
    });

    it('debe filtrar por categoría', async () => {
      const res = await request(app)
        .get('/api/proyectos')
        .query({ category: 'Ingeniería de Software' });
      expect(res.statusCode).toBe(200);
      expect(res.body.projects).toBeDefined();
    });

    it('debe paginar resultados', async () => {
      const res = await request(app)
        .get('/api/proyectos')
        .query({ page: 1, limit: 5 });
      expect(res.statusCode).toBe(200);
      expect(res.body.page).toBe(1);
    });
  });

  describe('POST /api/proyectos', () => {
    it('debe requerir autenticación', async () => {
      const res = await request(app).post('/api/proyectos').send({
        title: 'Proyecto sin auth',
        description: 'Descripción de prueba',
        category: 'Otro',
        university: 'Universidad Test',
        tags: 'tag1,tag2',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/busqueda', () => {
    it('debe buscar proyectos por texto', async () => {
      const res = await request(app).get('/api/busqueda').query({ q: 'sistema' });
      expect(res.statusCode).toBe(200);
      expect(res.body.results).toBeDefined();
    });

    it('debe retornar 400 sin parámetro q', async () => {
      const res = await request(app).get('/api/busqueda');
      expect(res.statusCode).toBe(400);
    });
  });
});
