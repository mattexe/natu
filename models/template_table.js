var mongoose = require('mongoose');
var TemplateTableSchema = new mongoose.Schema({
    owner: {
      type: String,
      required: true,
      trim: true
    },
    client: {
      type: String,
      required: false,
      trim: true
    },
    originalId: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
      trim: true
    },
    dateModified: {
      type: Date,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: false
    },
    published: {
      type: String,
      required: true
    }
});
var TemplateTable = mongoose.model('TemplateTable', TemplateTableSchema);
module.exports = TemplateTable;