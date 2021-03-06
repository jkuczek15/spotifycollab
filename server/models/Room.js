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
    playlistUri: {
        type: String
    },
    playlistId:{
        type: String
    },
    contextUri: {
        type: String
    },
    created: { type: Date, default: Date.now }
}, { strict: false, usePushEach: true });

RoomSchema.index({name: 'text', 'name': 'text'});
  
module.exports = mongoose.model('Room', RoomSchema);