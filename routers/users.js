const express = require('express');
var validator = require("email-validator");
const router = express.Router();
const User = require('../models/User');
const Gym = require('../models/Gym');
const Timing = require('../models/Timing');


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

module.exports =router;