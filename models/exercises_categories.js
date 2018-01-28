var mongoose = require('mongoose');
var ECatsSchema = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
});
var ECats = mongoose.model('ECats', ECatsSchema);
module.exports = ECats;