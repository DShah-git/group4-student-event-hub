import React, { useState, useEffect } from 'react'
import './home.css'
import { getAdminToken } from '../../../Util/adminAuth';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    Box,
    Chip,
    TextField
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";


export default function Adminhome() {

    const [events, setEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [search, setSearch] = useState("");

    async function fetchData() {
        try {
            let res = await axios.get("http://localhost:5000/admin/events/upcoming", { headers: { 'x-auth': getAdminToken() } })
            let dataEvents = res.data
            setEvents(dataEvents);
            setAllEvents(dataEvents)
            console.log(dataEvents)
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);


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


    return (
        <div className="page-container">
            <Box sx={{ width: "100%" }}>
                <div className="page-header-container">
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                        Events
                        <TextField
                            label="Search Events" variant="filled"
                            
                            value={search}
                            onChange={(e)=>handleSearchChange(e)}
                            sx={{margin:'1rem 0rem',  width: "100%"}}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                         
                        />
                    </Typography>
                    <Button
                        onClick={() => { window.location.href = "/admin/events/new" }}
                        startIcon={<AddIcon />} variant='contained' sx={{ width: '250px', height: '40px', fontSize: '1rem' }}>
                        Create New Event
                    </Button>
                </div>


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
                            md={3}
                            key={event._id}
                            sx={{
                                display: "flex",
                                justifyContent: "center"

                            }}
                        >
                            <Card
                                sx={{
                                    width: "455px",
                                    height: '400px',
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxSizing: "border-box",
                                    borderRadius: "10px",
                                    padding: '0.5rem 0rem',

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
                                            width: "100%",
                                            padding: '1rem 0.5rem',
                                            maxHeight: 400,
                                            overflowX: "hidden",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 6,
                                            WebkitBoxOrient: "vertical",
                                            fontSize: '1.05rem',
                                            minHeight: '90px'
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
                                        href={`/admin/events/${event._id}`}

                                        sx={{ width: "100%" }}
                                    >
                                        Open
                                    </Button>
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




                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>

    )
}
