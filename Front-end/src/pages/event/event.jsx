

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Box,
    Chip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import { getToken, isAuthenticated } from '../../Util/auth'
import TaskAltIcon from '@mui/icons-material/TaskAlt';


import './event.css'

export default function Event() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchEvent() {
        try {
            const res = await axios.get(`http://localhost:5000/student/event/${id}`,
                {
                    headers: {
                        'x-auth': getToken()
                    }
                });
            setEvent(res.data.event);
            console.log(res.data.event)
        } catch (err) {
            setError('Failed to fetch event');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        fetchEvent();
    }, [id]);

    async function handleRegister(eventId) {
        if (!isAuthenticated()) return
        try {
            let res = await axios.post("http://localhost:5000/student/event/register/" + eventId, {}, { headers: { 'x-auth': getToken() } })
            if (res.status == 200) {
                fetchEvent()
            }
        } catch (err) {
            console.log('error is registering for an event - ', err)
        }

    }

    async function handleVolunteer(eventId) {
        if (!isAuthenticated()) return
        try {
            let res = await axios.post("http://localhost:5000/student/event/volunteer/" + eventId, {}, { headers: { 'x-auth': getToken() } })
            if (res.status == 200) {
                fetchEvent()
            }
        } catch (err) {
            console.log('error is registering for an event - ', err)
        }
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
                <button className="back-btn" onClick={() => { window.location.href = "/" }}>

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

                        {isAuthenticated() ? (
                            <CardActions
                                sx={{
                                    justifyContent: "space-between",
                                    px: 2,
                                    pb: 2,
                                    pt: 0,
                                    gap: 1,
                                    marginTop: '2rem'
                                }}
                            >

                                {event.isStudentRegistered ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<HowToRegIcon />}
                                        disabled
                                        sx={{ fontWeight: "bold", width: "50%", backgroundColor: "#121111", color: "#fff", '&:hover': { backgroundColor: "#222", color: "#fff" } }}>

                                        Already Registered
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<HowToRegIcon />}
                                        onClick={() => handleRegister(event._id)}
                                        sx={{ fontWeight: "bold", width: "50%", backgroundColor: "#121111", color: "#fff", '&:hover': { backgroundColor: "#222", color: "#fff" } }}>

                                        Register
                                    </Button>
                                )}

                                {event.isStudentVolunteer ? (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        startIcon={<VolunteerActivismIcon />}
                                        sx={{ fontWeight: "bold", width: "50%" }}
                                        disabled
                                    >
                                        Volunteering
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        startIcon={<VolunteerActivismIcon />}
                                        sx={{ fontWeight: "bold", width: "50%" }}
                                        onClick={() => handleVolunteer(event._id)}
                                    >
                                        Volunteer
                                    </Button>
                                )}
                            </CardActions>
                        ) : (
                            <>
                                <Typography variant="body2" sx={{ padding: "1rem", textAlign: "center", }}> Please login to Register or Volunteer for an event
                                </Typography>
                            </>
                        )}
                    </div>

                </div>
                <div className="card-container  volunteer-container">
                    <h3 className='flex-icon' style={{ justifyContent: 'center', color: 'white', marginTop: '0rem', padding: "1rem 2rem", borderRadius: '10px', background: '#ed6c02' }} >
                        <VolunteerActivismIcon /> Volunteer Students
                    </h3>

                    <div className='student-names'>
                        {event.volunteerStudents.map((student) => (
                            <div className='student-name-card'>
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
                        {event.registeredStudents.map((student) => (
                            <div className='student-name-card'>
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
                <h2 className='flex-icon'>
                    <TaskAltIcon /> Tasks
                </h2>
                <div className="task-container">
                    {event.tasks.map((task) => (
                        <div className='task-card'>
                            <div className='student-name-card'>
                                <img
                                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${task.studentName}`}
                                    alt="avatar"
                                    className='avatar' />
                                {task.studentName}
                            </div>
                            <div className="tasks">
                                
                                {task.tasks.length == 0 ?  (<>
                                    <div className="text">
                                        No tasks yet
                                    </div>
                                </>):(
                                    <>
                                        {task.tasks.map((t,idx)=>(
                                            <div className="task">
                                               <span
                                               style={{padding:"0.25rem", borderRadius:"50%","color":"white",backgroundColor:"black"}}
                                               className='icon'
                                               >{idx+1} </span>
                                                {t}
                                            </div>
                                        ))}
                                    </>
                                )}
                                
                                
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>

        </div>
    );
}
