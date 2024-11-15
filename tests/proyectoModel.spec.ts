//npm install --save-dev jest //mongodb-memory-server mongoose
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Proyecto = require('./proyectoModel'); // Cambia a la ruta correcta del archivo

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
    await Proyecto.deleteMany(); // Limpiar la colección después de cada prueba
});

describe('Proyecto Model Test', () => {
    it('debería crear y guardar un proyecto correctamente', async () => {
        const proyectoData = {
            titulo: 'Proyecto de Prueba',
            descripcion: 'Descripción del proyecto de prueba',
            imagenes: ['http://imagen1.com', 'http://imagen2.com'],
            videos: ['http://video1.com', 'http://video2.com'],
            autor: new mongoose.Types.ObjectId() // Simula un ID de autor
        };

        const proyecto = new Proyecto(proyectoData);
        const savedProyecto = await proyecto.save();

        expect(savedProyecto._id).toBeDefined();
        expect(savedProyecto.titulo).toBe(proyectoData.titulo);
        expect(savedProyecto.descripcion).toBe(proyectoData.descripcion);
        expect(savedProyecto.imagenes).toEqual(expect.arrayContaining(proyectoData.imagenes));
        expect(savedProyecto.videos).toEqual(expect.arrayContaining(proyectoData.videos));
        expect(savedProyecto.autor).toEqual(proyectoData.autor);
    });

    it('debería fallar si se guarda un proyecto sin título requerido', async () => {
        const proyectoData = {
            descripcion: 'Descripción sin título',
            imagenes: ['http://imagen.com'],
            videos: ['http://video.com'],
            autor: new mongoose.Types.ObjectId()
        };

        const proyecto = new Proyecto(proyectoData);
        let error;

        try {
            await proyecto.save();
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});