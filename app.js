const express = require('express');
const app = express();
const usersRoute = require('./routers/users');
const gymsRoute = require('./routers/gyms');
const bodyParser = require('body-parser');
var cronJob = require('node-cron');
const cors = require('cors');
require('dotenv/config');


//Midlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/users',usersRoute);
app.use('/gyms',gymsRoute);

//Home Page
app.get('/',(req,res) => {
    res.send("Welcome to Gym App");
})

//Reset Appointment everyday
cronJob.schedule("00 00 * * *", function() {
        // Remove all the appointment which are invalid everyday.

        var date = new Date();
        var currentDate= date.getFullYear() + '-' + 
        ("0" + (date.getMonth() + 1)).slice(-2) + '-' + 
        ("0" + (date.getDate())).slice(-2);
        Appt.remove({
            date:{
                $lt:currentDate
            }
        });
}, undefined, true,"Asia/Kolkata");



//Connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true});

//Port Listen
app.listen(4500);
