const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede superar 200 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      minlength: [100, 'Mínimo 100 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: [
        'Ingeniería de Software',
        'Desarrollo Móvil',
        'Ciencia de Datos',
        'Educación Digital',
        'Tecnología en Salud',
        'Blockchain',
        'Inteligencia Artificial',
        'Internet de las Cosas',
        'Otro',
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    university: {
      type: String,
      required: [true, 'La universidad es obligatoria'],
      trim: true,
    },
    author: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    },
    image: {
      type: String,
      default: null,
    },
    files: [
      {
        name: String,
        path: String,
        size: Number,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Índice de texto para búsqueda
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Project', projectSchema);
