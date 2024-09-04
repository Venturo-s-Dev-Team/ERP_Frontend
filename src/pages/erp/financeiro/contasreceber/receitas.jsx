import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaFileExport } from "react-icons/fa";


function Receitas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReceita, setNewReceita] = useState({
    Nome: '',
    Valor: '',
    id_EmpresaDb: parseInt(userInfo.id_user)
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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

  // Função para carregar receitas do banco de dados
  useEffect(() => {
    const fetchReceitas = async (id) => {
      try {
        const response = await axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true });
        setReceitas(response.data.InfoTabela);
      } catch (error) {
        console.error("Erro ao carregar receitas", error);
      }
    };

    if (userInfo && userInfo.id_user) {
      fetchReceitas(userInfo.id_user);
    }
  }, [userInfo]);

  // Função para lidar com mudanças nos campos de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReceita({ ...newReceita, [name]: value });
  };

  // Função para registrar uma nova receita
  const handleRegisterReceita = async (e) => {
    e.preventDefault();
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    try {
      const response = await axios.post(`/api/ServerTwo/registrarReceitas`, newReceita, {
        withCredentials: true,
      });

      alert('Receita registrada com sucesso!');
      window.location.reload(); // Recarrega a página para atualizar a lista de receitas
    } catch (error) {
      console.error("Erro ao registrar receita:", error);
      alert('Erro ao registrar receita.');
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Receitas</h3>
      </div>

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

      <div className="Despesas_List">
        <table>
          <caption>Registro de Receita</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor por mês</th>
            </tr>
          </thead>
          <tbody>
            {receitas.map((receita) => (
              <tr key={receita.id}>
                <td>{receita.Nome}</td>
                <td>R$ {Number(receita.Valor).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <h1>Registrar Receita</h1>
          </div>

          <form onSubmit={handleRegisterReceita}>
            <input
              type="text"
              name="Nome"
              placeholder="Nome"
              value={newReceita.Nome}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="Valor"
              placeholder="Valor por Mês"
              value={newReceita.Valor}
              onChange={handleChange}
              required
            />
            <div className="FooterButton">
              <button className="RegisterPr" type="submit">
                Registrar
              </button>
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

export default Receitas;
