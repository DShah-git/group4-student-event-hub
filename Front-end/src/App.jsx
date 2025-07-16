import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Event from './pages/event/event';
import './App.css';
import Navbar from './components/Navbar';
import UpdateEvent from './pages/admin/updateEvent/UpdateEvent';
import Login from './pages/admin/login/login';
import Adminhome from './pages/admin/home/home';
import AdminEvent from './pages/admin/event/event';
import CreateEvent from './pages/admin/createEvent/CreateEvent';

function App() {
  return (
    <>
        <Navbar />
        <div className="app-container">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<Event />} />



            {/* admin paths */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />

            <Route path="admin/home" element={<Adminhome/>}/>
            <Route path="admin/events/:id" element={<AdminEvent/>}/>
            <Route path="admin/events/update/:id" element={<UpdateEvent/>}/>

            <Route path="admin/events/new" element={<CreateEvent/>}/>
            
 
          </Routes>
        </Router> 
    </div>
    </>
  );
}

export default App;
