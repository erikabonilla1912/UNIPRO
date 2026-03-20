const Reclamo = require('../models/reclamoModel');

// POST /api/reclamos
const createReclamo = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const reclamo = await Reclamo.create({ user: req.user._id, subject, message });
    res.status(201).json({ message: 'Reclamo enviado', reclamo });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear reclamo', error: error.message });
  }
};

// GET /api/reclamos (admin)
const getReclamos = async (req, res) => {
  try {
    const reclamos = await Reclamo.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reclamos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reclamos', error: error.message });
  }
};

// GET /api/reclamos/mis-reclamos
const getMisReclamos = async (req, res) => {
  try {
    const reclamos = await Reclamo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reclamos);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

module.exports = { createReclamo, getReclamos, getMisReclamos };
