const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('./app'); // Cambia a la ruta correcta del archivo

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('Pruebas para las rutas de la API', () => {
    it('debería registrar un usuario con éxito en /procesar_registro', async () => {
        const response = await request(app).post('/procesar_registro').send({
            nombre: 'Usuario de Prueba',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Registro exitoso');
        
        const user = await mongoose.model('User').findOne({ email: 'test@example.com' });
        expect(user).not.toBeNull();
        expect(user.nombre).toBe('Usuario de Prueba');
    });

    it('debería iniciar sesión exitosamente en /procesar_login', async () => {
        const user = new (mongoose.model('User'))({
            nombre: 'Usuario de Prueba',
            email: 'test@example.com',
            password: 'password123'
        });
        await user.save();

        const response = await request(app).post('/procesar_login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/PublicarProyecto.html');
    });

    it('debería devolver error para credenciales inválidas en /procesar_login', async () => {
        const response = await request(app).post('/procesar_login').send({
            email: 'test@example.com',
            password: 'wrongpassword'
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Usuario o contraseña incorrectos');
    });

    it('debería crear un reclamo exitosamente en /procesar_reclamo', async () => {
        const user = new (mongoose.model('User'))({
            nombre: 'Usuario de Prueba',
            email: 'test@example.com',
            password: 'password123'
        });
        await user.save();

        const response = await request(app).post('/procesar_reclamo').send({
            usuario: user._id,
            asunto: 'Asunto de prueba',
            mensaje: 'Mensaje de prueba'
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Reclamo enviado');
        
        const reclamo = await mongoose.model('Reclamo').findOne({ usuario: user._id });
        expect(reclamo).not.toBeNull();
        expect(reclamo.asunto).toBe('Asunto de prueba');
        expect(reclamo.mensaje).toBe('Mensaje de prueba');
    });

    it('debería crear un proyecto exitosamente en /procesar_proyecto', async () => {
        const user = new (mongoose.model('User'))({
            nombre: 'Usuario de Prueba',
            email: 'test@example.com',
            password: 'password123'
        });
        await user.save();

        const response = await request(app).post('/procesar_proyecto').send({
            usuario: user._id,
            titulo: 'Proyecto de prueba',
            descripcion: 'Descripción del proyecto de prueba',
            imagen: 'http://example.com/imagen.jpg',
            video: 'http://example.com/video.mp4'
        });
        expect(response.status).toBe(200);
        expect(response.text).toBe('Proyecto publicado');
        
        const proyecto = await mongoose.model('Proyecto').findOne({ usuario: user._id });
        expect(proyecto).not.toBeNull();
        expect(proyecto.titulo).toBe('Proyecto de prueba');
        expect(proyecto.descripcion).toBe('Descripción del proyecto de prueba');
    });
});