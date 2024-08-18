import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://192.168.0.177:3001/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);

  const Body = () => {
    if (userInfo) {
      if (userInfo.TypeUser === 'SuperAdmin') {
        return (
          <div className="perfil-body">
            <div className="perfil-info">
              <p className="perfil-id">ID: {userInfo.id_user}</p>
              <p className="perfil-nome">Nome: {userInfo.Nome_user}</p>
              <p className="perfil-email">Email: {userInfo.Email}</p>
            </div>
          </div>
        );
      } else if (userInfo.TypeUser === 'Admin') {
        return (
          <div className="perfil-body">
            <footer className="perfil-footer">
              <details className="perfil-details">
                <summary className="perfil-summary">
                  {!userInfo.id_EmpresaDb ? (
                    <div>Vazio</div>
                  ) : (
                    <img src={`http://192.168.0.177:3001/uploads/Logo/${userInfo.id_EmpresaDb}.png`} style={{ width: 100, height: 100 }} alt="" />
                  )}
                </summary>
                <p className="perfil-id">ID: {userInfo.id_user}</p>
                <p className="perfil-nome">Nome: {userInfo.Nome_user}</p>
                <p className="perfil-email">Email: {userInfo.Email}</p>
                <p>{userInfo.TypeUser}</p>
              </details>
            </footer>
          </div>
        );
      } else if (userInfo.RazaoSocial) {
        return (
          <div className="perfil-body">
            <footer className="perfil-footer">
              <details className="perfil-details">
                <summary className="perfil-summary">
                  {!userInfo.Logo ? (
                    <div>Perfil</div>
                  ) : (
                    <img src={`http://192.168.0.177:3001/uploads/Logo/${userInfo.Logo}`} style={{ width: 100, height: 100 }} alt="" />
                  )}
                </summary>
                <p className="perfil-id">ID: {userInfo.id_user}</p>
                <p className="perfil-nome">Nome: {userInfo.Nome_user}</p>
                <p>Empresa: {userInfo.RazaoSocial}</p>
                <p className="perfil-email">E-mail: {userInfo.Email}</p>
              </details>
            </footer>
          </div>
        );
      }
    } else {
      return <p>Carregando...</p>;
    }
  };

  return (
    <div className="perfil-container">
      <h1 className="perfil-header">Perfil</h1>
      <Body />
    </div>
  );
};

export default Perfil;