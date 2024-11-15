const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./userModel'); // Importa el modelo de usuario
const { check, validationResult } = require('express-validator'); // Para validar la entrada

const router = express.Router();

// Ruta de inicio de sesión
router.post(
  '/',
  [
    check('email', 'Debe proporcionar un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // El token expira en 1 hora
      );

      res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
