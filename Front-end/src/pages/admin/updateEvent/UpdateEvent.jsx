import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import {
  Typography,
  TextField,
  Button

} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAdminToken, isAdminAuthenticated } from '../../../Util/adminAuth'

import AccessTimeIcon from '@mui/icons-material/AccessTime';



export default function UpdateEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    } catch (err) {
      setError('Failed to fetch event');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(){
    
    delete event._id

    try{
      const res = await axios.post(`http://localhost:5000/admin/event/update/${id}`,{"event":event},
        {headers:{'x-auth':getAdminToken()}}
      )
      console.log(res)

      if(res.status == 200 && res.data.message){
        window.location.href = `/admin/events/${id}`
      }
    }catch(err){
      console.log(err)
    }
  }



  useEffect(() => {
    
    fetchEvent()
   
  }, [id]);

  function formatDateTime(dateString) {
    let date = new Date(dateString)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

 
  if (loading) return <Typography align="center" sx={{ mt: 6 }}>Loading...</Typography>;
  if (!event) return <Typography color="error" align="center" sx={{ mt: 6 }}>Event not found</Typography>;

  return (
    <div className='page-container'>
      <div className="back-container" >
        <button className="back-btn" onClick={() => { window.location.href = "/admin/home" }}>

          &#8592; Back
        </button>
      </div>

      <div className="card-container event-container">
        <h2 className='flex-icon'>
          <EventIcon />
          <TextField
            variant="filled"
            label="Event Title"
            value={event.title}
            onChange={e => setEvent({ ...event, title: e.target.value })}
            style={{width:'100%'}}
          />
        </h2>
        <div className="event-item">
          <h4>Event Description</h4>
          <p className='flex-icon desc' style={{ minHeight: '250px', overflowX: 'hidden', overflowY: 'scroll' }}>
            <textarea
              label="Event Description"
              value={event.description}
              
              style={{ width: '100%',minHeight:'250px' ,height: '100%', fontFamily: 'inherit', border: '0', fontSize: '1rem' }}
              onChange={e => setEvent({ ...event, description: e.target.value })}
            />
          </p>

          <div className='flex-icon'>
            <LocationOnIcon />
            <TextField
              variant="filled"
              label="Location"
              value={event.location}
              style={{width:'100%'}}
              onChange={e => setEvent({ ...event, location: e.target.value })}
            />
          </div>

          <div className='flex-icon'>
            <AccessTimeIcon />
            <TextField
              variant="filled"
              type='datetime-local'
              label="Date"
              style={{width:'100%'}}
              value={formatDateTime(event.dateTime)}
              onChange={e => setEvent({ ...event, dateTime: e.target.value })}
            />
          </div>
          <div className='flex-icon' style={{width:'100%',margin:'3rem 0rem'}}>
            <Button variant="contained"
            onClick={()=>handleUpdate()} 
            sx={{width:'100%', height: '50px'}}> Save </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
