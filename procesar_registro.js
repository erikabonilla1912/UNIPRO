const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./userModel');  // Importa el modelo de usuario

const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación de campos
  if (!nombre || !email || !password) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('El correo electrónico ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el nuevo usuario
    const newUser = new User({ nombre, email, password: hashedPassword });
    await newUser.save();

    res.send('Registro exitoso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

module.exports = router;
