const express = require('express');
const Event = require('../../Models/events.model');
const Announcement = require('../../Models/announcements.model')
const studentMiddleware = require('../../Middlewares/studentAuth.middleware')
const jwt = require('jsonwebtoken');
const router = express.Router();


router.get('/events/upcoming',async (req,res) => {
    try {
        
        const token = req.header('x-auth');

        let userId = ''

        if(token){
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId
        }
        
        const events = await Event.find({
        dateTime: { $gte: new Date() }
        }).sort({ dateTime: 1 }); 

       
        const eventsWithFlags = events.map(event => {
            const isStudentRegistered = event.registeredStudents && event.registeredStudents.some(s => s.studentID === userId);
            const isStudentVolunteer = event.volunteerStudents && event.volunteerStudents.some(s => s.studentID === userId);
           
            const eventObj = event.toObject ? event.toObject() : { ...event };
            return {
                ...eventObj,
                isStudentRegistered,
                isStudentVolunteer
            };
        });

        res.status(200).json(eventsWithFlags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


router.get('/events/completed',async (req,res) => {
    try {
        const events = await Event.find({
        dateTime: { $lte: new Date() }
        }).sort({ dateTime: 1 }); 

        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})


router.get('/event/:id',async (req,res) => {
    try{
        let eventId = req.params.id.toString();

        // Get userId from token if present
        const token = req.header && req.header('x-auth');
        let userId = '';
        if(token){
            try {
                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch (e) {
                userId = '';
            }
        }

        let event = await Event.findOne({"_id":eventId})

        if(!event){
            return res.status(400).json({"message":"Could not find Event"})
        }

        // Add isStudentRegistered and isStudentVolunteer flags
        const isStudentRegistered = event.registeredStudents && event.registeredStudents.some(s => s.studentID === userId);
        const isStudentVolunteer = event.volunteerStudents && event.volunteerStudents.some(s => s.studentID === userId);

        const eventObj = event.toObject ? event.toObject() : { ...event };
        eventObj.isStudentRegistered = isStudentRegistered;
        eventObj.isStudentVolunteer = isStudentVolunteer;

        return res.status(200).json({"message":"Event found", event: eventObj})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Error finding Event" });
    }
})



router.post('/event/register/:id', studentMiddleware, async (req, res) => {
    try{
        let eventId = req.params.id.toString();
        
        let student = req.user

        let studentToAdd = {
            studentID : student.userId,
            studentName : student.userName
        }


        let event = await Event.findById({_id:eventId}) 

        let regStudents = event.registeredStudents

        for(let s of regStudents){
            if(s.studentID == studentToAdd.studentID){
                return res.status(400).json({message:"Student is already registered"})
            }
        }
    
        event.registeredStudents.push(studentToAdd)

        await event.save()
        
        return res.status(200).json({message:"Student Registered successfully for event"})
        

    }catch(err){
        res.status(500).json({ message: err.message });
    }
})



router.post('/event/volunteer/:id', studentMiddleware, async (req, res) => {
    try{
        let eventId = req.params.id.toString();
        
        let student = req.user

        let studentToAdd = {
            studentID : student.userId,
            studentName : student.userName
        }

        let studentToAddforTask = {
            studentID : student.userId,
            studentName : student.userName,
            tasks: []
        }

        let event = await Event.findById({_id:eventId}) 


        let volStudent = event.volunteerStudents

        for(let s of volStudent){
            if(s.studentID == studentToAdd.studentID){
                return res.status(400).json({message:"Student is already volunteering"})
            }
        }
    
        event.volunteerStudents.push(studentToAdd)
        event.tasks.push(studentToAddforTask)
        
        await event.save()
        
        res.status(200).json({message:"Student added to volunteer"})
        

    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


router.get('/announcements', studentMiddleware, async (req,res)=>{
    try{
        let student = req.user

        let registeredOrVolunteerEvents = await Event.find({
           $and:[
           { dateTime: { $gte: new Date() }},
            {$or: [
                { "registeredStudents.studentID":student.userId },
                { "volunteerStudents.studentID":student.userId }
            ]}]
        }).select('_id')

        

        if(!registeredOrVolunteerEvents){
            return res.status(400).json({message:"Error Finding Announcements"})
        }

        registeredOrVolunteerEvents = registeredOrVolunteerEvents.map(e => e._id);

        const announcements = await Announcement.find({
            event_id: { $in: registeredOrVolunteerEvents }
        }).sort({posted_date:-1});

        if(!announcements){
            return res.status(400).json({message:"Error Finding Announcements"})
        }

        return res.status(200).json({message:"Announcements found",announcements:announcements})


        
    }catch(err){
        res.status(500).json({ message: err.message });
    }

})






module.exports = router;
