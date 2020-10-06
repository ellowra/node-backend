const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema({
    stime:{
        type:Number,
        required:true,
    },
    etime:{
        type:Number,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    }
});


module.exports = mongoose.model('appointment',AppointmentSchema,"appointment");