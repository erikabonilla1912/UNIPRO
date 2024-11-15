const request = require('supertest');
const express = require('express');
const router = require('./rutaDelRouter'); // Cambia a la ruta del archivo donde exportas el router
const User = require('./userModel');
const Reclamo = require('./reclamoModel');

jest.mock('./userModel');
jest.mock('./reclamoModel');

const app = express();
app.use(express.json()); // Necesario para analizar el JSON en las solicitudes
app.use('/reclamos', router);

describe('POST /reclamos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería devolver 404 si el usuario no existe', async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app)
            .post('/reclamos')
            .send({ email: 'noexiste@example.com', asunto: 'Asunto de prueba', mensaje: 'Mensaje de prueba' });

        expect(res.status).toBe(404);
        expect(res.text).toBe('Usuario no encontrado');
    });

    it('debería crear el reclamo y devolver "Reclamo enviado" si el usuario existe', async () => {
        const mockUser = { _id: 'usuarioId123' };
        User.findOne.mockResolvedValue(mockUser);
        Reclamo.prototype.save.mockResolvedValue({});

        const res = await request(app)
            .post('/reclamos')
            .send({ email: 'existe@example.com', asunto: 'Asunto de prueba', mensaje: 'Mensaje de prueba' });

        expect(res.status).toBe(200);
        expect(res.text).toBe('Reclamo enviado');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'existe@example.com' });
        expect(Reclamo.prototype.save).toHaveBeenCalled();
    });

    it('debería devolver 500 en caso de error en el servidor', async () => {
        User.findOne.mockRejectedValue(new Error('Error en la base de datos'));

        const res = await request(app)
            .post('/reclamos')
            .send({ email: 'error@example.com', asunto: 'Asunto de prueba', mensaje: 'Mensaje de prueba' });

        expect(res.status).toBe(500);
        expect(res.text).toBe('Error al procesar el reclamo');
    });
});