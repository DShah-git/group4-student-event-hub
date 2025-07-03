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

function EventsPanel() {

    const [events, setEvents] = useState([]);


    async function fetchData() {

        try {
            let res = await axios.get("http://localhost:5000/student/events/upcoming", { headers: { 'x-auth': getToken() ? getToken() : '' } })
            let dataEvents = res.data
            console.log(dataEvents)
            setEvents(dataEvents);
        } catch (err) {
            console.error("Error fetching events:", error);
        }

    }

    useEffect(() => {

        fetchData()
    }, []);


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

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Events Panel
            </Typography>
            <Grid
                container
                spacing={3}
                alignItems="stretch"
                sx={{
                    minHeight: "100%",
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
                                width: "100%",
                                width: 350,
                                minHeight: 400,
                                height: 400,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxSizing: "border-box",
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


                                <Typography
                                    variant="body2"

                                    sx={{
                                        mb: 2,
                                        overflow: "scroll",
                                        maxHeight: 400,
                                        overflowX: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 6,
                                        WebkitBoxOrient: "vertical",
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
                                    target="_blank"
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

                                            Registered
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