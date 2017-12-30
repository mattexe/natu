var mongoose = require('mongoose');
var ExerciseSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    video: {
      type: String,
      required: false,
      trim: true
    },
    gif: {
      type: String,
      required: false,
      trim: true
    },
    jpg: {
      type: String,
      required: false,
      trim: true
    },
    dateCreated: {
      type: Date,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    }
});
var Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise;