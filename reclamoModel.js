const mongoose = require('mongoose');

const reclamoSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, trim: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reclamo', reclamoSchema);
