const mongoose = require('mongoose');

const reclamoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'El asunto es obligatorio'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      minlength: [20, 'Mínimo 20 caracteres'],
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open',
    },
    response: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reclamo', reclamoSchema);
