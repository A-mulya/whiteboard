import React, { useState } from 'react';
import '../../src/index.css'; // Adjust path as needed

const Register = ({ onSwitch }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! Please log in.');
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Registration failed');
        setSuccess('');
      }
    } catch {
      setError('Server error');
      setSuccess('');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '-10px' }}>{success}</p>}

          <button type="submit" className="submit-btn">Register</button>

          <p>
            Already have an account?{' '}
            <span onClick={onSwitch} className="link-text">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
