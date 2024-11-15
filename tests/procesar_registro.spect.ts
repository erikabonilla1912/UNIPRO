const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./userModel.js'); // Cambia a la ruta correcta del modelo de usuario
const router = require('./rutaDelRouter'); // Cambia a la ruta del archivo donde exportas el router

jest.mock('./userModel');
jest.mock('bcrypt');

const app = express();
app.use(express.json());
app.use('/registro', router);

describe('POST /registro', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('debería crear un usuario y devolver "Registro exitoso"', async () => {
        // Mockear bcrypt.hash para que devuelva una contraseña hasheada
        bcrypt.hash.mockResolvedValue('hashedPassword123');
        // Mockear User.prototype.save para simular el guardado del usuario
        User.prototype.save.mockResolvedValue({});

        const res = await request(app)
            .post('/registro')
            .send({ nombre: 'Juan Perez', email: 'juan@example.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.text).toBe('Registro exitoso');
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(User.prototype.save).toHaveBeenCalled();
    });

    it('debería devolver 500 en caso de error en el servidor', async () => {
        // Mockear bcrypt.hash para que devuelva un error
        bcrypt.hash.mockRejectedValue(new Error('Error al hashear'));

        const res = await request(app)
            .post('/registro')
            .send({ nombre: 'Juan Perez', email: 'juan@example.com', password: 'password123' });

        expect(res.status).toBe(500);
        expect(res.text).toBe('Error al registrar el usuario');
    });
});