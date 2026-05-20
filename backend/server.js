const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://admin:Biblioteca2003@ac-c63ves8-shard-00-00.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-01.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-02.n1iunth.mongodb.net:27017/todolist?ssl=true&replicaSet=atlas-88duhx-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log(err));

// GET listar tareas
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST agregar tareas
app.post('/tasks', async (req, res) => {
    const nuevaTarea = new Task({
        texto: req.body.texto,
        fecha: new Date().toISOString().split("T")[0],
        completado: false
    });
    await nuevaTarea.save();
    res.json({
        mensaje: 'Tarea agregada',
        data: nuevaTarea
    });
});

// PUT actualizar tareas
app.put('/tasks/:id', async (req, res) => {
    await Task.findByIdAndUpdate(
        req.params.id,
        {
            texto: req.body.texto
        }
    );
    res.json({
        mensaje: 'Tarea actualizada'
    });
});

// DELETE eliminar tareas
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({
        mensaje: 'Tarea eliminada'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});