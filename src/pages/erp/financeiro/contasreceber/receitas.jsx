import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";

function Receitas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReceita, setNewReceita] = useState({
    Nome: '',
    Valor: '',
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
    if (userInfo && userInfo.id_EmpresaDb) {
      fetchReceitas(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  const fetchReceitas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true });
      setReceitas(response.data.InfoTabela);
    } catch (error) {
      console.error("Erro ao carregar receitas", error);
    }
  };

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
      const response = await axios.post(`/api/ServerTwo/registrarReceitas`, 
      {...newReceita, 
        id_EmpresaDb: id, 
        userId: userInfo.id_user,
        userName: userInfo.Nome_user}, 
        {
        withCredentials: true,
      });

      await fetchReceitas(id)
      handleClose()
    } catch (error) {
      console.error("Erro ao registrar receita:", error);
      alert('Erro ao registrar receita.');
    }
  };

  // Função para exportar dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(receitas); // Converte os dados de receitas em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Receitas"); // Adiciona a planilha ao livro

    // Gera o arquivo Excel e inicia o download
    XLSX.writeFile(wb, `Receitas_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Função para calcular o total de receitas
  const totalReceitas = receitas.reduce((acc, receita) => acc + Number(receita.Valor), 0);

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
        <button className="Button-Menu" onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>

      <div className="box_fluxo">
        <div className="saldo1-box">
          <h3>Total de receitas acumuladas</h3>
          <h1>R$ {totalReceitas.toFixed(2)}</h1> 
        </div>
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
            </div>
          </form>

          <button className="FecharPr" onClick={handleClose}>
            Fechar
          </button>
        </div>
      </Modal>
    </main>
  );
}

export default Receitas;
