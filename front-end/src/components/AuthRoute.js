import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

  const AuthRoute = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
      }
    }, [navigate]);
    return <props.component />;
};
  

export default AuthRoute;
