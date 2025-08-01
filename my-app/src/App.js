import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import WhiteBoard from './Whiteboard/Whiteboard';
import CursorOverlay from './CursorOverlay/CursorOverlay';
import Login from './pages/login';
import Register from './pages/register';
import RegistrationSuccess from './pages/registersucess';
import LoginSuccess from './pages/loginSuccess';
import CreateRoom from './pages/createRoom';

function AppWrapper() {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    navigate('/createRoom'); // Only private room path after login
  };

  const handleRegisterSuccess = () => {
    navigate('/register-success');
  };

  const toggleRegister = () => {
    setShowRegister(prev => !prev);
  };

  return (
    <Routes>
      <Route path="/" element={
        showRegister ? (
          <Register onSuccess={handleRegisterSuccess} onSwitch={toggleRegister} />
        ) : (
          <Login onSuccess={handleLoginSuccess} onSwitch={toggleRegister} />
        )
      } />

      <Route path="/createRoom" element={<CreateRoom />} />

      <Route path="/whiteboard/:roomId" element={
        <>
          <WhiteBoard />
          <CursorOverlay />
        </>
      } />

      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/register-success" element={<RegistrationSuccess />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
