const express = require('express');
const User = require('./userModel');
const Proyecto = require('./proyectoModel');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, titulo, descripcion, imagen, video } = req.body;

    // Validación de campos obligatorios
    if (!email || !titulo || !descripcion) {
        return res.status(400).send('Email, título y descripción son obligatorios');
    }

    try {
        // Buscar al usuario por su correo electrónico
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Crear el proyecto asociado al usuario encontrado
        const nuevoProyecto = new Proyecto({ 
            usuario: usuario._id, 
            titulo, 
            descripcion, 
            imagenes: Array.isArray(imagen) ? imagen : [imagen], 
            videos: Array.isArray(video) ? video : [video] 
        });
        await nuevoProyecto.save();
        res.send('Proyecto publicado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el proyecto');
    }
});

module.exports = router;
