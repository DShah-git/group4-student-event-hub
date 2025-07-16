
import { isAuthenticated } from "../Util/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import axios from "axios";
import {getToken} from "../Util/auth";
import { useState, useEffect } from "react";

function getTimeAgo(dateString) {
    const now = new Date();
    const posted = new Date(dateString);
    const diffMs = now - posted;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHr > 0) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return 'just now';
}


function formatToEST(dateString) {
    if (!dateString) return "-";
    // Parse as UTC and convert to America/New_York (EST/EDT)
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat for EST/EDT
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

function AnnouncementsPanel() {

    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/student/announcements",{headers: { 'x-auth': getToken() }})
            .then(response => {
                setAnnouncements(response.data.announcements);
                console.log(response.data.announcements);
            })
            .catch(error => {
                console.error("Error fetching announcements:", error);
            });
    }, []);

    if (isAuthenticated() === true) {
        return (
            <Box sx={{ width: "100%" }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                    Announcements
                </Typography>
                 
                <Grid container direction="column" spacing={2}
                    sx={{  borderRadius:"10px"}}
                >
                    {announcements.map((a) => (
                        <Grid item key={a._id}>
                            <Card
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow:2,
                                    bgcolor: '#fff',
                                }}
                            >
                                <CardContent>
                                    <Typography sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                                        {a.event_title}
                                    </Typography>
                                    
                                    <Typography  sx={{fontSize: '1.2rem', color: '#black'}}>
                                        {a.message}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', marginTop:'1rem'}}>
                                        <Typography sx={{ fontSize:'0.7rem' }}  color="text.secondary">
                                            <b>Event Date:</b> {formatToEST(a.event_date)}
                                        </Typography>
                                        <Typography sx={{ fontSize:'0.7rem' }} color="text.secondary">
                                            <b>Posted:</b> {getTimeAgo(a.posted_date)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    } else {
        return (
            <>
                <h1>Announcements Panel</h1>
                <h4>Please log in to view announcements</h4>
            </>
        );
    }
}

export default AnnouncementsPanel;