const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userSchema = require('./userModel.js'); // Asegúrate de que la ruta sea correcta

describe('User Model Test Suite', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany(); // Limpia los datos después de cada prueba
  });

  it('should create and save a user successfully', async () => {
    const userData = { nombre: 'Juan', email: 'juan@example.com', password: 'securepassword' };
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.nombre).toBe(userData.nombre);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it('should not save a user with a duplicate email', async () => {
    const userData = { nombre: 'Juan', email: 'juan@example.com', password: 'securepassword' };
    await new User(userData).save();

    const duplicateUser = new User(userData);

    let err;
    try {
      await duplicateUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Código de error para clave duplicada en MongoDB
  });

  it('should throw a validation error if required fields are missing', async () => {
    const user = new User({ email: 'missingfields@example.com' });

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.nombre).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});
