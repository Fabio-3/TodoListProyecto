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

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});