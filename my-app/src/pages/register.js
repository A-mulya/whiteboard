import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Register = ({ onSuccess, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(${process.env.REACT_APP_API_URL}/api/auth/register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-wrapper">
            <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="input-wrapper">
            <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" required value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle confirm password visibility">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <p style={{ color: 'red', marginTop: '-10px' }}>{error}</p>}
          <button type="submit" className="submit-btn">Register</button>
          <p>Already registered? <span onClick={onSwitch} className="link-text">Login</span></p>
        </form>
      </div>
    </div>
  );
};

export default Register;