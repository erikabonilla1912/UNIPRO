const Project = require('../models/proyectoModel');

// GET /api/busqueda?q=query
const buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });

    const results = await Project.find({
      status: 'approved',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
        { university: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('author', 'name university')
      .limit(20)
      .sort({ views: -1 });

    res.json({ results, total: results.length });
  } catch (error) {
    res.status(500).json({ message: 'Error en búsqueda', error: error.message });
  }
};

module.exports = { buscar };
