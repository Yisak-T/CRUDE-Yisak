import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role || 'viewer');
      if (res.data.studentId) {
        localStorage.setItem('studentId', res.data.studentId);
      }
      navigate('/');
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='p-3 bg-white w-25'>
        <form onSubmit={handleLogin}>
          <div className='mb-3'>
            <label>Email</label>
            <input type="email" className='form-control' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label>Password</label>
            <input type="password" className='form-control' onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className='btn btn-success w-100'>Login</button>
        </form>
        <div className='d-flex justify-content-between mt-3'>
          <button className='btn btn-link p-0' type="button" onClick={() => navigate('/register')}>Register</button>
          <button className='btn btn-link p-0' type="button" onClick={() => navigate('/request-reset')}>Forgot Password?</button>
        </div>
      </div>
    </div>
  )
}

export default Login;