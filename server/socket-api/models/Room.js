var mongoose = require('mongoose');

// Mongo DB Schema
var RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    users: {
        type: Array
    },
    queue: {
        type: Object
    },
    created: { type: Date, default: Date.now }
  }, { strict: false, usePushEach: true });
  
  module.exports = mongoose.model('Room', RoomSchema);