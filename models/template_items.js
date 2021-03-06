var mongoose = require('mongoose');
var TemplateItemSchema = new mongoose.Schema({
    position: {
      type: String,
      required: false,
      trim: true
    },
    id_template: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    item_id: {
      type: String,
      required: false
    },
    type: {
      type: String,
    },
    sessions: {
      type: Number,
    },
    repetitions: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    time: {
      type: String,
    },
    dateCreated: {
      type: Date,
    },
    item_title: {
      type: String,
    },
    item_description: {
      type: String,
    },
    item_image: {
      type: String,
    },
    item_gif: {
      type: String,
    },
    item_video: {
      type: String,
    }
});
var TemplateItem = mongoose.model('TemplateItem', TemplateItemSchema);
module.exports = TemplateItem;