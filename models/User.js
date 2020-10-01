const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
    },
    phone: {
        type: Number,
        required:true,
    },
    pass: {
        type: String,
        required:true,
    },
    gcode: {
        type: String,
        required:true,
    },
    appointment:{
        type:Boolean,
        required:true,
    }
});

module.exports = mongoose.model('user',UserSchema,"user");