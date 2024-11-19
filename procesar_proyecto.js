const express = require('express');
const User = require('./userModel');
const Proyecto = require('./proyectoModel');

const router = express.Router();

// Ruta para publicar un proyecto
router.post('/', async (req, res) => {
    const { email, titulo, descripcion } = req.body;
    try {
        // Buscar al usuario por su correo electrónico
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Crear el proyecto asociado al usuario encontrado
        const nuevoProyecto = new Proyecto({ usuario: usuario._id, titulo, descripcion });
        await nuevoProyecto.save();
        res.send('Proyecto publicado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el proyecto');
    }
});

// Ruta para obtener todos los proyectos
router.get('/proyectos', async (req, res) => {
    try {
        const proyectos = await Proyecto.find().populate('usuario', 'email nombre'); // Obtener todos los proyectos con información del usuario

        if (proyectos.length > 0) {
            res.status(200).json(proyectos); // Devolver los proyectos como JSON
        } else {
            res.status(200).send('No hay proyectos disponibles');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los proyectos');
    }
});

module.exports = router;
