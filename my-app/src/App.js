import React, { useEffect, useState } from 'react';
import WhiteBoard from './Whiteboard/Whiteboard';
import CursorOverlay from './CursorOverlay/CursorOverlay';
import Login from '../src/pages/login';
import Register from '../src/pages/register';
import RegistrationSuccess from '../src/pages/registersucess';
import LoginSuccess from '../src/pages/loginSuccess';
import { connectWithSocketServer } from './socketConn/socketConn';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState('');

  useEffect(() => {
    connectWithSocketServer();
  }, []);

  const handleLoginSuccess = () => {
    setShowSuccessPage('login');
    // Show success screen, then login
    setTimeout(() => {
      setIsLoggedIn(true);
      setShowSuccessPage('');
    }, 2000);
  };

  const handleRegisterSuccess = () => {
    setShowSuccessPage('register');
    // Show success screen, then switch to login
    setTimeout(() => {
      setShowRegister(false);
      setShowSuccessPage('');
    }, 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowSuccessPage('');
  };

  const toggleRegister = () => {
    setShowRegister(prev => !prev);
    setShowSuccessPage('');
  };

  if (showSuccessPage === 'register') return <RegistrationSuccess />;
  if (showSuccessPage === 'login') return <LoginSuccess />;

  if (!isLoggedIn) {
    return showRegister ? (
      <Register onSuccess={handleRegisterSuccess} onSwitch={toggleRegister} />
    ) : (
      <Login onSuccess={handleLoginSuccess} onSwitch={toggleRegister} />
    );
  }

  return (
    <>
      <WhiteBoard onLogout={handleLogout} />
      <CursorOverlay />
    </>
  );
}

export default App;
