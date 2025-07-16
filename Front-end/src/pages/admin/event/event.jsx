import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import {
    CardActions,
    Typography,
    Button,


} from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAdminToken, isAdminAuthenticated } from '../../../Util/adminAuth'
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteIcon from '@mui/icons-material/Delete';

import './event.css'

export default function AdminEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [announcements, setAnnouncements] = useState([])

    const [newAnnouncement, setNewAnnouncement] = useState("")

    const [addAnnouncementToggle, setAddAnnouncementToggle] = useState(false)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [taskInputs, setTaskInputs] = useState([]);

    async function fetchEvent() {
        try {
            const res = await axios.get(`http://localhost:5000/admin/event/${id}`,
                {
                    headers: {
                        'x-auth': getAdminToken()
                    }
                });
            setEvent(res.data.event);

            if (res.data.event && res.data.event.tasks) {
                setTaskInputs(Array(res.data.event.tasks.length).fill(""));
            }
            console.log(res.data.event)
        } catch (err) {
            setError('Failed to fetch event');
        } finally {
            setLoading(false);
        }
    }

    async function fetchAnnouncements() {
        try {
            const res = await axios.get(`http://localhost:5000/admin/event/announcement/${id}`, { headers: { 'x-auth': getAdminToken() } })
            console.log(res.data.announcements)
            setAnnouncements(res.data.announcements)


        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleAddAnnouncement() {
        let message = newAnnouncement
        
        try{
            const res = await axios.post("http://localhost:5000/admin/event/announcement/create",
            {
                "event":event,
                "message":message
            },{ headers: { 'x-auth': getAdminToken() } })  
            
            if(res){
                setNewAnnouncement("")
                setAddAnnouncementToggle(false)
                fetchAnnouncements()
            }
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {

        fetchEvent();
        fetchAnnouncements()
    }, [id]);



    async function handleAddTask(i) {

        let eventToSave = event
        eventToSave.tasks[i].tasks.push(taskInputs[i])
        setEvent({ ...eventToSave })

        delete eventToSave._id
        let inputs = taskInputs
        inputs[i] = ""

        setTaskInputs([...inputs])

        try {
            const res = await axios.post(`http://localhost:5000/admin/event/update/${id}`,
                { event: eventToSave },
                { headers: { 'x-auth': getAdminToken() } }
            )
        } catch (err) {
            console.log("Error adding task - ", err)
        }


    }

    async function deleteTask(studentIndex, taskIndex){
        let eventToSave = event
        
        eventToSave.tasks[studentIndex].tasks.splice(taskIndex,1)
        
        setEvent({ ...eventToSave })

        delete eventToSave._id


         try {
            const res = await axios.post(`http://localhost:5000/admin/event/update/${id}`,
                { event: eventToSave },
                { headers: { 'x-auth': getAdminToken() } }
            )
        } catch (err) {
            console.log("Error adding task - ", err)
        }
        
    }


    async function updateEvent(){

    }



    function formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            // Convert to US Eastern Time (EST/EDT)
            return date.toLocaleString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                weekday: 'long'
            });
        } catch {
            return dateString;
        }
    }

    if (loading) return <Typography align="center" sx={{ mt: 6 }}>Loading...</Typography>;
    if (error) return <Typography color="error" align="center" sx={{ mt: 6 }}>{error}</Typography>;
    if (!event) return <Typography color="error" align="center" sx={{ mt: 6 }}>Event not found</Typography>;

    return (
        <div className='page-container'>
            <div className="back-container" >
                <button className="back-btn" onClick={() => { window.location.href = "/admin/home" }}>

                    &#8592; Back
                </button>
            </div>

            <div className="triple-container">
                <div className="card-container event-container">
                    <h2 className='flex-icon'>
                        <EventIcon /> {event.title}
                    </h2>
                    <div className="event-item">
                        <p className='flex-icon desc' style={{ minHeight: '250px', overflowX: 'hidden', overflowY: 'scroll' }}>
                            {event.description}
                        </p>

                        <div className='flex-icon'>
                            <LocationOnIcon /> {event.location}
                        </div>

                        <div className='flex-icon'>
                            <AccessTimeIcon /> {formatDate(event.dateTime)}
                        </div>
                        <CardActions
                            sx={{
                                justifyContent: "center",
                                px: 2,
                                pb: 2,
                                pt: 0,
                                gap: 1,
                                margin: "2.5rem 0rem"
                            }}>

                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                href={`/admin/events/update/${event._id}`}
                               
                                sx={{ width: "100%" }}
                            >
                                Edit
                            </Button>

                        </CardActions>

                    </div>

                </div>
                <div className="card-container  volunteer-container">
                    <h3 className='flex-icon' style={{ justifyContent: 'center', color: 'white', marginTop: '0rem', padding: "1rem 2rem", borderRadius: '10px', background: '#ed6c02' }} >
                        <VolunteerActivismIcon /> Volunteer Students
                    </h3>

                    <div className='student-names'>
                        {event.volunteerStudents.map((student,i) => (
                            <div className='student-name-card' key={i}>
                                <img
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${student.studentName}`}
                                    alt="avatar"
                                    className='avatar' />
                                {student.studentName}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-container  registered-container">
                    <h3 className='flex-icon' style={{ justifyContent: 'center', color: 'white', marginTop: '0rem', padding: "1rem 2rem", borderRadius: '10px', background: '#60a932' }} >
                        <VolunteerActivismIcon /> Registered Students
                    </h3>

                    <div className='student-names'>
                        {event.registeredStudents.map((student,i) => (
                            <div className='student-name-card' key={i}>
                                <img
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${student.studentName}`}
                                    alt="avatar"
                                    className='avatar' />
                                {student.studentName}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="task-container card-container">
                <h2 className='flex-icon' style={{ marginBottom: '0rem' }}>
                    <TaskAltIcon /> Tasks
                </h2>
                <div className="task-container" style={{ marginTop: '0rem' }}>
                    {event.tasks.map((task, i) => (
                        <div className='task-card' key={i}>
                            <div className='student-name-card'>
                                <img
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${task.studentName}`}
                                    alt="avatar"
                                    className='avatar' />
                                {task.studentName}
                            </div>
                            <div className="tasks">
                                {task.tasks.length === 0 ? (
                                    <div className="text">No tasks yet</div>
                                ) : (
                                    <>
                                        {task.tasks.map((t, idx) => (
                                            <div className="task" key={idx}>
                                                <span
                                                    style={{ padding: "0.25rem", borderRadius: "50%", color: "white", backgroundColor: "black" }}
                                                    className='icon'
                                                >{idx + 1} </span>
                                                
                                                {t}

                                                <Button color="error" 
                                                onClick={()=>deleteTask(i,idx)}
                                                sx={{ height:'25px', width:'25px'}}>
                                                    <DeleteIcon style={{width:'20px'}}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="add-button">
                                <input
                                    className="input-task"
                                    type="text"
                                    value={taskInputs[i] || ""}
                                    onChange={e => {
                                        const newInputs = [...taskInputs];
                                        newInputs[i] = e.target.value;
                                        setTaskInputs(newInputs);
                                    }}
                                />
                                <button className="add-task"
                                    onClick={() => handleAddTask(i)}
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="card-container announcement-container">
                <h2 className='flex-icon' style={{  margin: "0.5rem 2rem !important" }}>
                    <CampaignIcon sx={{ scale: 1.3 }} /> Announcement
                </h2>

                 {
                    addAnnouncementToggle == true &&
                    <div style={{marginTop:'3rem'}}>
                        <h4>Add Announcement</h4>
                        <div style={{ display:'flex',alignItems:'start', margin:"1rem  0rem"}}>
                            <textarea
                                className="input-task"
                                type="text"
                                rows={5}
                                style={{width:'450px'}}
                                
                                onChange={(e) => setNewAnnouncement(e.target.value)}
                            />
                            <button className="add-task"
                                onClick={() => handleAddAnnouncement()}
                            >
                                Add
                            </button>
                        </div>
                        
                    </div>
                }

                <Button variant='outlined' sx={{ height: '40px', width: '200px', marginTop: '1rem', borderRadius: '10px' }} 
                    onClick={()=>{setAddAnnouncementToggle(!addAnnouncementToggle)}}
                >
                    {
                        addAnnouncementToggle ?
                        (
                            <>
                                Cancel
                            </>
                        ) : (
                            <>
                                Add Announcement
                            </>
                        )
                    }
                </Button>

                {announcements.map((announcement) => (
                    <div className='announcement-container' key={announcement._id}>
                        <h4>
                            Message
                        </h4>
                        <p className='announcement-message'>
                            {announcement.message}
                        </p>


                        <span>
                            Posted On - {formatDate(announcement.posted_date)}
                        </span>


                    </div>
                ))}

               
            </div>

        </div>
    );
}
