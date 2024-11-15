const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Reclamo = require('./reclamoModel'); // Cambia a la ruta correcta del archivo

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
    await Reclamo.deleteMany(); // Limpia la colección después de cada prueba
});

describe('Reclamo Model Test', () => {
    it('debería crear y guardar un reclamo correctamente', async () => {
        const reclamoData = {
            titulo: 'Reclamo de prueba',
            descripcion: 'Descripción del reclamo de prueba',
            autor: new mongoose.Types.ObjectId() // Simula un ID de autor
        };

        const reclamo = new Reclamo(reclamoData);
        const savedReclamo = await reclamo.save();

        expect(savedReclamo._id).toBeDefined();
        expect(savedReclamo.titulo).toBe(reclamoData.titulo);
        expect(savedReclamo.descripcion).toBe(reclamoData.descripcion);
        expect(savedReclamo.autor).toEqual(reclamoData.autor);
    });

    it('debería fallar si se guarda un reclamo sin título requerido', async () => {
        const reclamoData = {
            descripcion: 'Descripción sin título',
            autor: new mongoose.Types.ObjectId()
        };

        const reclamo = new Reclamo(reclamoData);
        let error;

        try {
            await reclamo.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});