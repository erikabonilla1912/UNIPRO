const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/procesar_login');
const { getProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto } = require('../controllers/procesar_proyecto');
const { createReclamo, getReclamos, getMisReclamos } = require('../controllers/procesar_reclamo');
const { buscar } = require('../controllers/procesar_busqueda');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// Proyectos
router.get('/proyectos', getProyectos);
router.get('/proyectos/:id', getProyectoById);
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/proyectos', protect, upload.single('image'), createProyecto);
router.put('/proyectos/:id', protect, updateProyecto);
router.delete('/proyectos/:id', protect, deleteProyecto);

// Reclamos
router.post('/reclamos', protect, createReclamo);
router.get('/reclamos', protect, adminOnly, getReclamos);
router.get('/reclamos/mis-reclamos', protect, getMisReclamos);

// Búsqueda
router.get('/busqueda', buscar);

// Admin - aprobar/rechazar proyecto
router.patch('/proyectos/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const project = await require('../models/proyectoModel').findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json({ message: 'Estado actualizado', project });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// Admin - obtener todos los proyectos (incluyendo pending)
router.get('/admin/proyectos', protect, adminOnly, async (req, res) => {
  try {
    const projects = await require('../models/proyectoModel').find().sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

// IA - Gemini
const { mejorarDescripcion, chat, sugerenciasBusqueda } = require('../controllers/procesar_ia');
router.post('/ia/mejorar-descripcion', protect, mejorarDescripcion);
router.post('/ia/chat', chat);
router.post('/ia/sugerencias-busqueda', sugerenciasBusqueda);

// Dashboard analytics
router.get('/admin/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const Project = require('../models/proyectoModel');
    const Reclamo = require('../models/reclamoModel');

    const [
      totalUsers,
      totalProjects,
      pendingProjects,
      approvedProjects,
      totalReclamos,
      openReclamos,
      projectsByCategory,
      recentProjects,
      topProjects,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: 'pending' }),
      Project.countDocuments({ status: 'approved' }),
      Reclamo.countDocuments(),
      Reclamo.countDocuments({ status: 'open' }),
      Project.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Project.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt university'),
      Project.find({ status: 'approved' }).sort({ views: -1 }).limit(5).select('title views downloads'),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        pendingProjects,
        approvedProjects,
        totalReclamos,
        openReclamos,
      },
      projectsByCategory,
      recentProjects,
      topProjects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

module.exports = router;
