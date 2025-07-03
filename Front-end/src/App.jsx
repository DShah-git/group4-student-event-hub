import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import './App.css';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div className="app-container"
    >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router> 
    </div>
  );
}

export default App;
