require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./userModel');
const Reclamo = require('./reclamoModel');
const Proyecto = require('./proyectoModel');

const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Configurar bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar middleware para servir archivos estáticos desde el directorio 'views'
app.use(express.static(path.join(__dirname, 'views')));

// Ruta para procesar el registro
app.post('/procesar_registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nombre, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: 'Registro exitoso' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el registro' });
    }
});

// Ruta para procesar el inicio de sesión
app.post('/procesar_login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.redirect('/views/PublicarProyecto.html');
        } else {
            res.json({ error: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Ruta para procesar el reclamo
app.post('/procesar_reclamo', async (req, res) => {
    try {
        const { usuario, asunto, mensaje } = req.body;
        const nuevoReclamo = new Reclamo({ usuario, asunto, mensaje });
        await nuevoReclamo.save();
        res.json({ message: 'Reclamo enviado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el reclamo' });
    }
});

// Ruta para procesar la publicación de proyecto
app.post('/procesar_proyecto', async (req, res) => {
    try {
        const { usuario, titulo, descripcion, imagen, video } = req.body;
        const nuevoProyecto = new Proyecto({ usuario, titulo, descripcion, imagen, video });
        await nuevoProyecto.save();
        res.json({ message: 'Proyecto publicado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al publicar el proyecto' });
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
