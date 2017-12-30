var mongoose = require('mongoose');
var DocumentSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    }
    description: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    dateCreated: {
      type: Date,
      required: true,
      trim: true
    },
    cateogry: {
      type: String,
      required: true
    }
});
var Document = mongoose.model('Document', DocumentSchema);
module.exports = Document;