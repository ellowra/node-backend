const mongoose = require('mongoose');

const TimingSchema = mongoose.Schema({
    gcode:{
        type:String,
        required:true,
    },
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


module.exports = mongoose.model('timing',TimingSchema,"timing");