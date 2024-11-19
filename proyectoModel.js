const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  titulo: String,
  descripcion: String,
});


module.exports = mongoose.model('Proyecto', proyectoSchema);
