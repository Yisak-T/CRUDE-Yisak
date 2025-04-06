import React, { useState } from 'react';
import axios from 'axios';

function RequestReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/request-reset', { email });
      if (res.data.success) {
        setMessage("Reset link has been sent to your email.");
      } else {
        setMessage("Error: " + res.data.message);
      }
    } catch (err) {
      setMessage("Error requesting password reset.");
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <h2>Request Password Reset</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-success w-100">Send Reset Link</button>
        </form>
        {message && <p className="mt-3 text-center text-info">{message}</p>}
      </div>
    </div>
  );
}

export default RequestReset;