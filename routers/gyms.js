const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');
const Timing = require('../models/Timing');


router.get("/",(req,res)=>{
    res.send("Posts");
})

//Owner Add timing
router.post('/addtiming', async (req,res) => {
    const gcode_var = req.body.gcode;
    const gExist = await Gym.find({
        gcode:gcode_var
    }).countDocuments();
    const timeExist = await Timing.find({
        gcode:gcode_var,
        stime:req.body.stime,
    }).countDocuments();
    if(gExist==1 && timeExist==0){
        try{
            const newTiming = new Timing({
                gcode:req.body.gcode,
                stime:req.body.stime,
                etime:req.body.etime,
                count:0,
                limit:req.body.limit
            })
            await newTiming.save();
            res.send("1"); //Added Timing
        }
        catch(err){
            console.log(err);
    
            res.send("-1");
            //res.json({message:err});
        }
    }
    else if(timeExist==1)
        res.send("0");  // Time Already Exist
    else   
        res.send("2"); // Error
        
});


module.exports =router;