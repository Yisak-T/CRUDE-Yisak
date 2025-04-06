import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:8081/reset-password/${token}`, { password })
      .then(() => {
        alert("Password reset successfully.");
        navigate('/login');
      })
      .catch(() => alert("Password reset failed."));
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleReset}>
          <h2>Reset Password</h2>
          <div className='mb-2'>
            <label>New Password</label>
            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-success w-100">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;