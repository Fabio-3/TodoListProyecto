const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({

    texto: {
        type: String,
        required: true
    },

    fecha: {
        type: String
    },

    completado: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('Task', TaskSchema);