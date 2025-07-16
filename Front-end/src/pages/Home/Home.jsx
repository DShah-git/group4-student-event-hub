import Button from '@mui/material/Button';
import Navbar from '../../components/navbar';
import EventsPanel from '../../components/EventsPanel';
import AnnouncementsPanel from '../../components/AnnouncementsPanel';
import './home.css';
import Typography from "@mui/material/Typography";

const Home = () => {
  return (
    <div className="home-container">

     
      <div className="home-main-content">
        <div className="events-panel-wrapper">
          <EventsPanel />
        </div>
        <div className="announcements-panel-wrapper">
          <AnnouncementsPanel />

        </div>
      </div>

    </div>
  );



};




export default Home;