const express = require('express');
const Event = require('../../Models/events.model');
let Announcement = require('../../Models/announcements.model') 
const adminMiddleware = require('../../Middlewares/adminAuth.middleware')

const router = express.Router();


router.get('/events/upcoming',adminMiddleware,async (req,res) => {
    try {
        const events = await Event.find({
        dateTime: { $gte: new Date() }
        }).sort({ dateTime: 1 }); 

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get('/events/completed',adminMiddleware,async (req,res) => {
    try {
        const events = await Event.find({
        dateTime: { $lte: new Date() }
        }).sort({ dateTime: 1 }); 

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})



router.post('/event/create', adminMiddleware, async (req, res) => {
    try{
        const { title, description, dateTime, location } = req.body;

        const admin = req.user
        
        if(!title || !description || !dateTime || !location) return res.status(400).json({'message':"Following fields are required - title, description, dateTime, location"})

        const newEvent = new Event({
            title:title,
            description:description,
            dateTime:new Date(dateTime),
            location:location,
            creator:admin.userId,
            registeredStudents:[],
            volunteerStudents:[],
            tasks:[]
        })        

        await newEvent.save();

        return res.status(200).json({message:"New Event created successfully",event:newEvent})
            
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


router.get('/events/completed',adminMiddleware,async (req,res) => {
    try {
        const events = await Event.find({
        dateTime: { $lte: new Date() }
        }).sort({ dateTime: 1 }); 

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})



router.post('/event/create-multiple', adminMiddleware, async (req, res) => {
    try{

        let all = req.body.multiple

        console.log(all[0])

        for(let i=0;i<all.length;i++){
            
            const { title, description, dateTime, location } = all[i];

            const admin = req.user
            
            if(!title || !description || !dateTime || !location) return res.status(400).json({'message':"Following fields are required - title, description, dateTime, location"})

            const newEvent = new Event({
                title:title,
                description:description,
                dateTime:new Date(dateTime),
                location:location,
                creator:admin.userId,
                registeredStudents:[],
                volunteerStudents:[],
                tasks:[]
            })        

            await newEvent.save();

            
        }
      
        return res.status(200).json({message:"All events created"})
            
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})



router.post('/event/update/:id', adminMiddleware, async (req, res) => {
    try{
        let eventId = req.params.id.toString();
        let event = req.body.event

        let eventUpdate = await Event.findByIdAndUpdate({_id:eventId},event,{new:true}) 
        
      
        if(eventUpdate){
            return res.send({message:"Event updated successfully",event:eventUpdate})
        }else{
            return res.status(400).send({message:"Could not process update"}) 
        }
    
            
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


router.post('/event/announcement/create',adminMiddleware,async (req,res)=>{
    try{
        let {event,message} = req.body

        

        if(!event || !message){
            return res.status(400).json({message:"Following fields are required - event, message"})
        }

        let newAnnouncements = new Announcement({
            message:message,
            event_id:event._id,
            event_title:event.title,
            event_date:event.dateTime,
            posted_date: new Date()
        })


        await newAnnouncements.save();

        return res.status(200).json({message:"New Announcement created",announcement:newAnnouncements})

        
    }catch(err){
        return res.status(500).json({message:"Error in creating in announcement", error:err})
    }
})




router.get('/event/:id',adminMiddleware,async (req,res)=>{
     try{
        let eventId = req.params.id.toString();

        let event = await Event.findOne({"_id":eventId})


        if(!event){
            return res.status(400).json({"message":"Could not find Event"})
        }
        
        return res.status(200).json({"message":"Event found",event:event})
      
            
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Error finding Event" });
    }
})



router.get('/event/announcement/:id',adminMiddleware,async (req,res)=>{
     try{
        let eventId = req.params.id.toString();

        let announcements = await Announcement.find({"event_id":eventId})


        if(!announcements){
            return res.status(400).json({"message":"Could not find announcements"})
        }
        
        return res.status(200).json({"message":"Announcements found",announcements:announcements})
      
            
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Error finding announcements" });
    }
})


module.exports = router;
