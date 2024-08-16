import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const Perfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://10.144.170.13:3001/verifyToken', { withCredentials: true });
        console.log('Token recebido:', response.data.token); // Adicione este log
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/');
      }
    };
    
    verifyToken();
}, [navigate]);

  const Body = () => {
    if (userInfo) {
      if (userInfo.TypeUser === 'SuperAdmin') {
        return (
          <div>
            <p>ID: {userInfo.id_user}</p>
            <p>Nome: {userInfo.Nome_user}</p>
            <p>Email: {userInfo.Email}</p>
          </div>
        );
      } else if (userInfo.TypeUser === 'Admin') {
        return (
          <div>
            <footer>
              <details>
                <summary>
                  {!userInfo.id_EmpresaDb ? (
                    <div>Vazio</div>
                  ) : (
                    <img src={`http://10.144.170.13:3001/uploads/Logo/${userInfo.id_EmpresaDb}.png`} style={{ width: 100, height: 100 }} alt="" />
                  )}
                </summary>
                <p>ID: {userInfo.id_user}</p>
                <p>Nome: {userInfo.Nome_user}</p>
                <p>Email: {userInfo.Email}</p>
                <p>{userInfo.TypeUser}</p>
              </details>
            </footer>
          </div>
        );
      } else if (userInfo.RazaoSocial) {
        return (
          <div>
            <footer>
              <details>
                <summary>
                  {!userInfo.Logo ? (
                    <div>Perfil</div>
                  ) : (
                    <img src={`http://10.144.170.13:3001/uploads/Logo/${userInfo.Logo}`} style={{ width: 100, height: 100 }} alt="" />
                  )}
                </summary>
                <p>ID: {userInfo.id_user}</p>
                <p>Nome_user: {userInfo.Nome_user}</p>
                <p>Empresa: {userInfo.RazaoSocial}</p>
                <p>E-mail: {userInfo.Email}</p>
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
    <div>
      <h1>Perfil</h1>
      <Body />
    </div>
  );
};

export default Perfil;