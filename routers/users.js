const express = require('express');
var validator = require("email-validator");
const router = express.Router();
const User = require('../models/User');
const Gym = require('../models/Gym');
const Timing = require('../models/Timing');
const Appt = require('../models/Appointment');


//Test
router.get('/', async (req,res)=>{
    const valid = await User.find({});
    res.json(valid);
});

//Login
router.get('/login/:username/:pass', async (req,res) => {
    try{
        const valid = await User.find({
            email: req.params.username,
        }).countDocuments();
        if(valid == 1){
            const check = await User.find({
                email: req.params.username,
                pass: req.params.pass
            }).countDocuments();
            if(check==1)
                res.send("1") // Logged In
            else    
                res.send("2"); //Incorrect Password
        }
        if(valid == 0)
            res.send("0"); //Not Exist
        }
    catch(err){
        console.log(err);

        res.send("-1");
        //res.json({message:err});
    }
});


//Sign-up
router.post('/', async (req,res) => {
    const gExist = await Gym.find({
        gcode:req.body.gcode,
    }).countDocuments();
      
    const emailExist = await User.find({
        email:req.body.email
    }).countDocuments();
    if(emailExist==0){
        if(validator.validate(req.body.email) && gExist==1)
        {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                pass: req.body.pass,
                phone: req.body.phone,
                gcode: req.body.gcode,
                appointment:false,
            })

            try{
                await user.save()
                res.send("1"); //saved
            }
            catch(err){
                console.log(err);
        
                res.send("-1");
                //res.json({message:err});
            }
        }
        else if(gExist==0){
            res.send("3"); //Enter valid Gym Code
        }
        else{
            res.send("-2"); //Enter valid Email and password 
        }
    }
    else{
        res.send("-3"); // Existing Email
    }

});

//get the gym timing
router.get('/gymtiming/:gcode', async (req,res)=>{
    try{
        const timing = await Timing.find({
            gcode:req.params.gcode,
        },{
            _id:0,
            stime:1,
            etime:1,
        });
        res.json(timing);
    }catch (err){
        
        console.log(err);

        res.send("-1");
        //res.json({message:err});
    }
});

router.get('/details/:email', async (req,res)=>{
    try{
        const getGcode = await User.find({
            email:req.params.email,
        },{
            gcode:1,
            _id:0
        });
        var gcode = getGcode[0].gcode;
        const detail = await Gym.find({
            gcode:gcode
        },{
            _id:0
        })
        res.json(detail[0]);
    }catch (err){
        console.log(err);
        res.send("-1");
    }
});

//Appointment
router.post('/appointment', async (req,res) => {
    const gExist = await Gym.find({
        gcode:req.body.gcode,
    }).countDocuments();
    const userExist = await User.find({
        email:req.body.email,
    }).countDocuments();
      
    if(userExist==1 && gExist==1){
        // check if the given timing has slot left
        const available = await Timing.find({
            gcode:req.body.gcode,
            stime:req.body.stime,
            $expr:{
                $gte:[ "$limit","$count"]
            }
        }).countDocuments(); 

        var date = new Date();
        var currentDate= date.getFullYear() + '-' + 
        ("0" + (date.getMonth() + 1)).slice(-2) + '-' + 
        ("0" + (date.getDate())).slice(-2);

        if(available==1){
            const appt = new Appt({
                email: req.body.email,
                code: req.body.gcode,
                stime: req.body.stime,
                etime: req.body.etime,
                date: currentDate
            });
            //Increment the value from Gym count
            await Timing.updateOne({
                gcode:req.body.gcode,
                stime:req.body.stime,
            },{
                $inc: { count:1}
            });

            //change the field in user profile
            await User.updateOne({
                email:req.body.email
            },{
               $set:{
                   appointment:true
               } 
            });

            try{
                await appt.save()
                res.send("1");  //Appointment Made
            }
            catch(err){
                console.log(err);
        
                res.send("-1");
                //res.json({message:err});
            }
        }
        else{
            res.send("0");  //Limit Exeeded
        }        
    }
    else{
        if(gExist==0){
            res.send("3");  // Enter Valid Gym Code
        }
        if(userExist==0)
            res.send("4");  // Enter Valid Email
    }
});

router.delete('/delappointment', async (req,res)=>{
    //Appointment Document Removed
    await Appt.remove({
        gcode:req.body.gcode,
        date:req.body.date,
        stime:req.body.stime
    });

    res.send("1"); // Deleted
});

router.get('/getappointment/:email/:gcode', async (req,res) => {
    
    try{
            const list = await Appt.find({
            email:req.params.email,
            code:req.params.gcode,
        },{
            stime:1,
            etime:1,
            date:1,
            _id:0
        });
        res.json(list);
    }
    catch(err){
        res.json({message:err});
    }
});



module.exports =router;