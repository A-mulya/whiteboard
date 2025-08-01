import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/createRoom');
    }, 2000);
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Registration Successful!</h2>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
