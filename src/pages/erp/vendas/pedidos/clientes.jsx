import React, {useState, useEffect} from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function clientes() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [Clientes, setClientes] = useState([])


  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_user) {
      fetchDados(userInfo.id_user);
    }
  }, [userInfo]);

  const verifyToken = async () => {
    try {
      const response = await axios.get('http://192.168.1.75:3002/verifyToken', { withCredentials: true });
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

  const fetchDados = async (id) => {
    try {
      const response = await axios.get(`http://192.168.1.75:3002/tableCliente/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

      {/* Botões do header */}
      <div className="Button_Cad">
          <button className="Button-Menu" >
            Adicionar
            <FaPlus />
          </button>
          <button className="Button-Menu">
            Editar
            <FaPenToSquare />
          </button>
          <button className="Button-Menu">
            Excluir
            <FaTrashCan />
          </button>
        </div>

        <div className="Clientes_List">
          <table>
            <caption>Listagem de Clientes</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ/CPF</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {Clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.Nome}</td>
                  <td>{cliente.CPF_CNPJ}</td>
                  <td>{cliente.Enderecoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </main>
  );
}

export default clientes;
