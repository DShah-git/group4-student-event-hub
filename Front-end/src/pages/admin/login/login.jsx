import React, { useEffect, useState } from 'react';
import './login.css';
import axios from 'axios';
import {adminLogin,isAdminAuthenticated} from '../../../Util/adminAuth'
import { useNavigate  } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

   useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/home', { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/auth/admin/login', {
        email,
        password
      });
      
      if(res.data.token){
        adminLogin(res.data.token)
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="admin-login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="admin-login-input"
          required
        />
        {error && <div className="admin-login-error">{error}</div>}
        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
