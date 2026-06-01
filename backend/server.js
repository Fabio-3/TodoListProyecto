const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Task = require('./models/Task');
const app = express();
const USER = {
    username: 'admin',
    password: '12345'
};
passport.use(
    new LocalStrategy(
        (username, password, done) => {
            if (
                username === USER.username &&
                password === USER.password
            ) {
                return done(null, USER);
            }
            return done(
                null,
                false,
                {
                    message:
                    'Usuario o contraseña incorrectos'
                }
            );
        }
    )
);
const opcionesJWT = {
    jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secreto123'
};
passport.use(
    new JwtStrategy(
        opcionesJWT,
        (payload, done) => {
            if (
                payload.username === USER.username
            ) {
                return done(null, USER);
            }
            return done(null, false);
        }
    )
);
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
app.use(passport.initialize());

mongoose.connect('mongodb://admin:Biblioteca2003@ac-c63ves8-shard-00-00.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-01.n1iunth.mongodb.net:27017,ac-c63ves8-shard-00-02.n1iunth.mongodb.net:27017/todolist?ssl=true&replicaSet=atlas-88duhx-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.log(err));

app.post(
    '/login',
    passport.authenticate(
        'local',
        {
            session: false
        }
    ),
    (req, res) => {
        const token = jwt.sign(
            {
                username: USER.username
            },
            'secreto123',
            {
                expiresIn: '24h'
            }
        );
        res.status(200).json({
            mensaje: 'Login correcto',
            token: token
        });
    }
);

// GET listar tareas
app.get('/tasks', passport.authenticate('jwt',{
          session: false
    }),
    async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60');
    const tasks = await Task.find();
    res.status(200).json({
        mensaje: 'Lista de tareas',
        data: tasks
    });
});

// POST agregar tareas
app.post('/tasks', passport.authenticate('jwt', {
        session: false
    }),
    async (req, res) => {
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
app.put('/tasks/:id', passport.authenticate('jwt', {
        session: false
    }),
    async (req, res) => {
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
app.delete('/tasks/:id', passport.authenticate('jwt', {
        session: false
    }),
    async (req, res) => {
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
app.post('/files', passport.authenticate('jwt', {
        session: false
    }),
    upload.single('archivo'), (req, res) => {
    res.status(201).json({
        mensaje: 'Archivo subido',
        archivo: req.file.filename
    });
});

// GET listar archivos
app.get('/files', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
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
app.get('/files/download/:nombre', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
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
app.delete('/files/:nombre', passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
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