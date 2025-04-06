import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/register', { name, email, password })
      .then(() => {
        alert("Registration successful. Please check your email to verify.");
        navigate('/login');
      })
      .catch(() => alert("Registration failed"));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <div className='mb-2'>
            <label>Name</label>
            <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='mb-2'>
            <label>Email</label>
            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-2'>
            <label>Password</label>
            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;