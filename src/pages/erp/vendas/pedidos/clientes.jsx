import React, {useState, useEffect} from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, Modal, Form } from "react-bootstrap";
import { FaFileExport } from "react-icons/fa";



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

  const fetchDados = async (id) => {
    try {
      const response = await axios.get(`/api/ServerTwo/tableCliente/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

      {/* Botões do header */}
      <div className="Button_Cad">
         <button className="Button-Menu" onClick={handleShow}>
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
          <button className="Button-Menu">
            Exportar
            <FaFileExport />
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

          {/* Modal de Adicionar Produto */}

      <Modal
        style={{
          position: "fixed",
          top: "50%",
          bottom: 0,
          left: "50%",
          right: 0,
          zIndex: 1000,
          width: "70%",
          height: "73%",
          borderRadius: 20,
          transform: "translate(-50%, -50%)",
          background: "white",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={handleClose}
      >
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Registrar Clientes</h1>
          </div>

          <form>
            <input type="text" placeholder="Nome" />
            <input type="CNPJ" placeholder="CNPJ/CPF" />
            <input type="text" placeholder="Endereço" />
            <div className="FooterButton">
              <button className="RegisterPr">Registrar</button>
              <button className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </main>
  );
}

export default clientes;
