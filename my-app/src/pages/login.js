import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onSuccess, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-wrapper">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}
          <button type="submit" className="submit-btn">Login</button>
          <p>Don’t have an account? <span onClick={onSwitch} className="link-text">Register</span></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
