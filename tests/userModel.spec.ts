const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./userModel'); // Asegúrate de ajustar la ruta si es necesario

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

describe('User Model Test Suite', () => {
    it('debería crear un usuario con éxito', async () => {
        const userData = { nombre: 'Usuario Test', email: 'test@example.com', password: 'password123' };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.nombre).toBe(userData.nombre);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
    });

    it('debería lanzar un error por email duplicado', async () => {
        const userData = { nombre: 'Usuario Test', email: 'test@example.com', password: 'password123' };
        const user1 = new User(userData);
        await user1.save();

        const user2 = new User(userData);
        let error;
        try {
            await user2.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe(11000); // Código de error de MongoDB para duplicados
    });

    it('debería requerir un campo de email', async () => {
        const userData = { nombre: 'Usuario Test', password: 'password123' };
        const userWithoutEmail = new User(userData);

        let error;
        try {
            await userWithoutEmail.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.email.kind).toBe('required');
    });

    it('debería requerir un campo de nombre', async () => {
        const userData = { email: 'test@example.com', password: 'password123' };
        const userWithoutNombre = new User(userData);

        let error;
        try {
            await userWithoutNombre.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeDefined();
        expect(error.errors.nombre).toBeDefined();
        expect(error.errors.nombre.kind).toBe('required');
    });
});