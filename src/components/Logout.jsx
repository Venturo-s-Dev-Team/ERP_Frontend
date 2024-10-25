import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userId, id_EmpresaDb } = location.state || {};

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/logout', { params: { userName, userId, id_EmpresaDb }, withCredentials: true });
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