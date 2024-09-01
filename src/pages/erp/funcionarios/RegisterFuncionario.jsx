import React, { useState, useEffect } from 'react';
import SuccessPopup from './SuccessPopup'; // Importe o componente pop-up
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import './RegisterFuncionario.css';

function CadastroFuncionario() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [Funcionarios, setFuncionarios] = useState([])

  // Função para verificar o token
useEffect(() => {
  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
      
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

useEffect(() => {
  if (userInfo.id_user) {
    fetchFuncionarios(userInfo.id_user);
  }
}, [userInfo]);

const fetchFuncionarios = async (id) => {
  try {
    const response = await axios.get(`/api/ServerOne/tableFuncionario/${id}`, { withCredentials: true });
    if (response.status === 200) {
      setFuncionarios(response.data.InfoTabela);
    }
  } catch (error) {
    console.log('Não foi possível requerir as informações: ', error);
  }
};

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSuccess = () => {
    closePopup();
  };

  return (
    <main className="main-container">

<div className="main-title">
        <h3>Cadastrar Funcionário</h3>
      </div>

      <div className="Estoque_Cad">
        <div className="Button_Cad">
        <button onClick={openPopup}>Cadastrar Funcionário</button>
      
        </div>
        </div>
      {/* Exibir o pop-up se showPopup for verdadeiro */}
      {showPopup && <SuccessPopup onClose={closePopup} onSubmit={handleSuccess} />}


      <div className="Estoque_List">
          <table>
            <caption>Listagem de Funcionários</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Setor</th>
              </tr>
            </thead>
            <tbody>
              {Funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.Nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.TypeUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </main>
  );
}

export default CadastroFuncionario;
