const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'Mínimo 6 caracteres'],
      select: false,
    },
    university: {
      type: String,
      required: [true, 'La universidad es obligatoria'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
