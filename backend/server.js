const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const Task = require('./models/Task');
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

app.set('etag', true);
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://admin:Biblioteca2003@ac-c63ves8-shard-00-00.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-01.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-02.n1iunth.mongodb.net:27017/todolist?ssl=true&replicaSet=atlas-88duhx-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log(err));

// GET listar tareas
app.get('/tasks', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60');
    const tasks = await Task.find();
    res.status(200).json({
        mensaje: 'Lista de tareas',
        data: tasks
    });
});

// POST agregar tareas
app.post('/tasks', async (req, res) => {
    if (!req.body.texto || req.body.texto.trim() === "") {
        return res.status(400).json({
            mensaje: 'La tarea está vacía'
        });
    }
    const nuevaTarea = new Task({
        texto: req.body.texto,
        fecha: new Date().toISOString().split("T")[0],
        completado: false
    });
    await nuevaTarea.save();
    res.status(201).json({
        mensaje: 'Tarea agregada',
        data: nuevaTarea
    });
});
// PUT actualizar tareas
app.put('/tasks/:id', async (req, res) => {
    if (!req.body.texto || req.body.texto.trim() === "") {
        return res.status(400).json({
            mensaje: 'Texto vacío'
        });
    }
    const tareaActualizada = await Task.findByIdAndUpdate(
        req.params.id,
        {
            texto: req.body.texto
        },
        {
            returnDocument: 'after'
        }
    );
    if (!tareaActualizada) {
        return res.status(404).json({
            mensaje: 'Tarea no encontrada'
        });
    }
    res.status(200).json({
        mensaje: 'Tarea actualizada',
        data: tareaActualizada
    });
});

// DELETE eliminar tareas
app.delete('/tasks/:id', async (req, res) => {
    const tareaEliminada = await Task.findByIdAndDelete(
        req.params.id
    );
    if (!tareaEliminada) {
        return res.status(404).json({
            mensaje: 'Tarea no encontrada'
        });
    }
    res.status(200).json({
        mensaje: 'Tarea eliminada',
        data: tareaEliminada
    });
});

// POST subir archivos
app.post('/files', upload.single('archivo'), (req, res) => {
    res.status(201).json({
        mensaje: 'Archivo subido',
        archivo: req.file.filename
    });
});

// GET listar archivos
app.get('/files', (req, res) => {
    res.set('Cache-Control', 'public, max-age=60');
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al leer archivos'
            });
        }
        const archivos = files.map((file) => {
            const stats = fs.statSync(`uploads/${file}`);
            const tamañoKB = (stats.size / 1024).toFixed(2);
            const fechaFormateada =
                new Date(stats.mtime).toLocaleDateString('es-BO');
            return {
                nombre: file,
                tamaño: `${tamañoKB} KB`,
                fecha: fechaFormateada
            };
        });
        res.status(200).json({
            mensaje: 'Lista de archivos',
            data: archivos
        });
    });
});

// GET descargar archivo
app.get('/files/download/:nombre', (req, res) => {
    const nombreArchivo = req.params.nombre;
    const rutaArchivo = `uploads/${nombreArchivo}`;
    res.download(rutaArchivo, nombreArchivo, (err) => {
        if (err) {
            res.status(404).json({
                mensaje: 'Archivo no encontrado'
            });
        }
    });
});

// DELETE eliminar archivo
app.delete('/files/:nombre', (req, res) => {
    const nombreArchivo = req.params.nombre;
    const rutaArchivo = `uploads/${nombreArchivo}`;
    fs.unlink(rutaArchivo, (err) => {
        if (err) {
            return res.status(404).json({
                mensaje: 'Archivo no encontrado'
            });
        }
        res.status(200).json({
            mensaje: 'Archivo eliminado'
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});