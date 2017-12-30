var mongoose = require('mongoose');
var NoteSchema = new mongoose.Schema({
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      required: true,
      trim: true
    },
    dateCreated: {
      type: Date,
      required: true,
      trim: true
    }
});
var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;