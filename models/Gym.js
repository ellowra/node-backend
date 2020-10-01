const mongoose = require('mongoose');

const GymTimingSchema = mongoose.Schema({
    stime:{
        type:Number,
        required:true,
    },
    etime:{
        type:Number,
        required:true,
    },
    count:{
        type:Number,
        required:true,
    },
    limit:{
        type:Number,
        required:true,
    }
});

const GymSchema = mongoose.Schema({
    gname: {
        type: String,
        required:true,
    },
    gcode: {
        type: String,
        required:true,
    },
    time:[GymTimingSchema],
});

module.exports = mongoose.model('gym',GymSchema,"gym");