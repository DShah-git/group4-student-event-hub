import React from "react";
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
import axios from "axios";
import { useState, useEffect } from "react";
import { getToken, isAuthenticated } from '../Util/auth'
import './styles/scroll.css'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";


function EventsPanel() {
    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [search, setSearch] = useState("");

    async function fetchData() {
        try {
            let res = await axios.get("http://localhost:5000/student/events/upcoming", { headers: { 'x-auth': getToken() ? getToken() : '' } })
            let dataEvents = res.data
            setEvents(dataEvents);
            setAllEvents(dataEvents);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

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

    async function handleRegister(eventId) {
        if (!isAuthenticated()) return
        try {
            let res = await axios.post("http://localhost:5000/student/event/register/" + eventId, {}, { headers: { 'x-auth': getToken() } })
            if (res.status == 200) {
                fetchData()
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
                fetchData()
            }
        } catch (err) {
            console.log('error is registering for an event - ', err)
        }
    }

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearch(value);
        if (!value) {
            setEvents(allEvents);
            return;
        }
        const filtered = allEvents.filter(ev =>
            ev.title.toLowerCase().includes(value.toLowerCase()) ||
            ev.description.toLowerCase().includes(value.toLowerCase()) ||
            ev.location.toLowerCase().includes(value.toLowerCase())
        );
        setEvents(filtered);
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Events Panel
            </Typography>
            <Box sx={{ flex: 2, marginBottom:"1.5rem" }}>
                <Paper
                    component="form"
                    sx={{
                        p: "2px 8px",
                       
                        width: 350,
                        borderRadius: 2,
                        boxShadow: "none",
                        border: "1px solid #e0e0e0",
                    }}
                >
                    <TextField
                        variant="standard"
                        placeholder="Search events"
                        value={search}
                        onChange={handleSearchChange}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: "100%" }}
                    />
                </Paper>
            </Box>
            <Grid
                container
                spacing={3}
                alignItems="stretch"
                sx={{
                    minHeight: "100%",
                    width: "100%"
                }}
            >
                {events.map((event) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={event._id}
                        sx={{
                            display: "flex",
                            justifyContent: "center",

                        }}
                    >
                        <Card
                            sx={{
                                width: "550px",
                                height: '430px',
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxSizing: "border-box",
                                borderRadius: "10px",
                                padding: '0.5rem 0rem'
                            }}
                            elevation={3}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    {event.title}
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "space-between !important", justifyContent: "center", mb: 1, width: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <LocationOnIcon color="primary" sx={{ mr: 0.5 }} />
                                        <Typography variant="body2" color="text.secondary" >
                                            {event.location}
                                        </Typography>


                                    </div>

                                    <Chip
                                        icon={<GroupIcon />}
                                        label={`${event.registeredStudents.length} Attendees`}

                                        size="small"
                                        sx={{ mt: 1, backgroundColor: "transparent", color: "#000" }}
                                    />
                                </Box>
                                <div className='flex-icon' style={{ fontSize: "0.9rem", display: 'flex', alignItems: "center", gap: "0.5rem" }}>
                                    <AccessTimeIcon color="primary" sx={{ mr: 0.5 }} />
                                    {formatDate(event.dateTime)}
                                </div>


                                <Typography
                                    variant="body2"

                                    sx={{
                                        mb: 2,
                                        overflowY: "scroll",
                                        width: "calc( 100% - 2rem)",
                                        padding: '0.5rem 1rem',
                                        marginTop:'1rem',
                                        overflowX: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 6,
                                        WebkitBoxOrient: "vertical",
                                        fontSize: '1.05rem',
                                        height: '110px',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                                        borderRadius:'10px'
                                    }}
                                >
                                    {event.description}
                                </Typography>

                            </CardContent>
                            <CardActions
                                sx={{
                                    justifyContent: "center",
                                    px: 2,
                                    pb: 2,
                                    pt: 0,
                                    gap: 1
                                }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<OpenInNewIcon />}
                                    href={`/events/${event._id}`}
                                   
                                    sx={{ width: "100%" }}
                                >
                                    Open
                                </Button>

                            </CardActions>

                            {isAuthenticated() ? (
                                <CardActions
                                    sx={{
                                        justifyContent: "space-between",
                                        px: 2,
                                        pb: 2,
                                        pt: 0,
                                        gap: 1,
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


                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default EventsPanel;