const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  imagenes: [{ type: String, match: /^https?:\/\// }], // Arreglo de URLs de imágenes válidas
  videos: [{ type: String, match: /^https?:\/\// }],   // Arreglo de URLs de videos válidas
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Proyecto', proyectoSchema);
