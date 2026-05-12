const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, university, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const user = await User.create({ name, email, university, password });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Cuenta desactivada' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };
