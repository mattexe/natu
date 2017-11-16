var mongoose = require('mongoose');
var EjercicioSchema = new mongoose.Schema({
    titulo: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    video: {
      type: String,
      required: true,
      trim: true
    },
    gif: {
      type: String,
      required: true,
      trim: true
    },
    jpg: {
      type: String,
      required: true,
      trim: true
    },
    dateCreated: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      required: true
    }
});
var Ejercicio = mongoose.model('Ejercicio', EjercicioSchema);
module.exports = Ejercicio;