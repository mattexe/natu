var mongoose = require('mongoose');
var TableItemSchema = new mongoose.Schema({
    position: {
      type: String,
      required: false,
      trim: true
    },
    id_tabla: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    item_id: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: true
    },
    sessions: {
      type: Number,
      required: true
    },
    repetitions: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    dateCreated: {
      type: Date,
      required: true
    },
    item_title: {
      type: String,
      required: true
    },
    item_description: {
      type: String,
      required: true
    },
    item_image: {
      type: String,
      required: true
    },
    item_gif: {
      type: String,
      required: true
    },
    item_video: {
      type: String,
      require: true
    }
});
var TableItem = mongoose.model('TableItem', TableItemSchema);
module.exports = TableItem;