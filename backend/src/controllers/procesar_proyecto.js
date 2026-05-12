const Project = require('../models/proyectoModel');

// GET /api/proyectos
const getProyectos = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'approved' };

    if (category && category !== 'Todos') filter.category = category;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('author', 'name university')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
};

// GET /api/proyectos/:id
const getProyectoById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Intentar populate solo si author es un ObjectId válido
    let populated = project.toObject();
    try {
      const pop = await Project.findById(req.params.id).populate('author', 'name university');
      if (pop) populated = pop.toObject();
    } catch (e) {}

    // Incrementar vistas
    project.views += 1;
    await project.save();

    res.json(populated);
  } catch (error) {
    console.error('Error getProyectoById:', error);
    res.status(500).json({ message: 'Error al obtener proyecto', error: error.message });
  }
};

// POST /api/proyectos
const createProyecto = async (req, res) => {
  try {
    const { title, description, category, tags, university } = req.body;

    const tagsArray = typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim())
      : tags;

    const project = await Project.create({
      title,
      description,
      category,
      tags: tagsArray,
      university,
      author: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({ message: 'Proyecto enviado para revisión', project });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proyecto', error: error.message });
  }
};

// PUT /api/proyectos/:id
const updateProyecto = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    Object.assign(project, req.body);
    await project.save();
    res.json({ message: 'Proyecto actualizado', project });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

// DELETE /api/proyectos/:id
const deleteProyecto = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    if (project.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await project.deleteOne();
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};

module.exports = { getProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto };
