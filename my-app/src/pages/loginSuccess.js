import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/createRoom');
    }, 2000);
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login Successful!</h2>
        <p>Loading your whiteboard...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
