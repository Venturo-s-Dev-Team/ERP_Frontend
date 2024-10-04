import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/logout', { withCredentials: true });
        if (response) {
          navigate('/login');
        }
      } catch (err) {
        alert('Erro ao efetuar logout');
      }
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <p>Efetuando logout...</p>
    </div>
  );
}

export default Logout;