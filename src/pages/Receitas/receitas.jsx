import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import { FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import "./receitas.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Receitas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Modo de edição
  const [SelectedReceita, setSelectedReceita] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [newReceita, setNewReceita] = useState({
    Nome: '',
    Valor: '',
  });

  // Modal control
  const handleShow = () => {
    setShowModal(true);
  };
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

    if (!isEditMode) {
      try {
        const response = await axios.post(`/api/ServerTwo/registrarReceitas`,
          {
            ...newReceita,
            id_EmpresaDb: id,
            userId: userInfo.id_user,
            userName: userInfo.Nome_user
          },
          {
            withCredentials: true,
          });

        await fetchReceitas(id);
        handleClose();
      } catch (error) {
        console.error("Erro ao registrar receita:", error);
        alert('Erro ao registrar receita.');
      }
    } else {
      try {
        const response = await axios.put(`/api/ServerTwo/EditReceita`,
          {
            ...newReceita,
            id_EmpresaDb: id,
            id_Receita: SelectedReceita.id,
            userId: userInfo.id_user,
            userName: userInfo.Nome_user
          },
          {
            withCredentials: true,
          });

        await fetchReceitas(id);
        handleClose();
      } catch (error) {
        console.error("Erro ao registrar receita:", error);
        alert('Erro ao registrar receita.');
      }
    }
  };

  // Função para editar a receita
  const handleEdit = () => {
    if (!SelectedReceita) {
      alert("Por favor, selecione uma receita para editar.");
      return;
    }

    // Validar se a receita começa com "Venda de número"
    if (SelectedReceita.Nome.startsWith("Venda de número")) {
      alert("Você só pode editar receitas que não começam com 'Venda de número'.");
      return;
    }

    // Entrar no modo de edição e abrir o modal
    setIsEditMode(true);
    setNewReceita({
      Nome: SelectedReceita.Nome,
      Valor: SelectedReceita.Valor,
    });
    setShowModal(true);
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

  // Filtro das receitas
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredReceita = receitas.filter(
    (Receita) =>
      Receita.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Receita.Valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(Receita.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SideBarPage>
      <main>
        <div>
          <h3>Receitas</h3>
        </div>

        <div className="scroll-despesas">
          <div className="Button_Cad">
            <button onClick={handleShow}>
              Adicionar
              <FaPlus />
            </button>
            <button onClick={handleEdit} disabled={!SelectedReceita}>
              Editar
              <FaPenToSquare />
            </button>
            <button onClick={exportToExcel}>
              Exportar
              <FaFileExport />
            </button>
          </div>

          <div className="box_receitas">
            <div className="total-box">
              <h3>Total de receitas acumuladas</h3>
              <h1>R$ {totalReceitas.toFixed(2)}</h1>
            </div>
          </div>

          {/* Input de pesquisa */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "350px",
            }}
          >
            <BsSearch
              style={{ marginLeft: "10px", color: "#888", fontSize: "18px" }}
            />
            <input
              type="text"
              placeholder="Pesquisar receitas"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #fff",
                padding: "12px",
                fontSize: "16px",
                width: "300px",
                outline: "none",
                transition: "border-color 0.3s",
                paddingLeft: "10px",
              }}
            />
          </div>

          <div className="Receitas_List">
            <table>
              <caption>Registro de Receita</caption>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor por mês</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceita.map((receita) => (
                  <tr key={receita.id}>
                    <td>{receita.Nome}</td>
                    <td>R$ {Number(receita.Valor).toFixed(2)}</td>
                    <td>
                      <label className="custom-radio">
                        <input
                          type="radio"
                          name="selectedProduct"
                          value={receita.id}
                          onChange={() => setSelectedReceita(receita)}
                        />
                        <span className="radio-checkmark"></span>
                      </label>
                    </td>
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
              left: "58%",
              right: 0,
              zIndex: 1000,
              width: "50%",
              height: "50%",
              borderRadius: 20,
              transform: "translate(-50%, -50%)",
              background: "white",
              boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
            }}
            show={showModal}
            onHide={handleClose}
          >
            <div className="DivModalReceitas">
              <div>
                <h1>{isEditMode ? "Editar Receita" : "Registrar Receita"}</h1>
              </div>

              <form onSubmit={handleRegisterReceita}>
                <input
                  type="text"
                  name="Nome"
                  placeholder="Nome"
                  value={newReceita.Nome}
                  onChange={handleChange}
                  required
                  // Remova o "disabled" se quiser permitir a edição do nome
                  disabled={false} // Para editar o nome em modo de edição
                />
                <input
                  type="number"
                  name="Valor"
                  placeholder="Valor"
                  value={newReceita.Valor}
                  onChange={handleChange}
                  required
                />
                <div>
                  <button className="RegisterPr" type="submit">
                    {isEditMode ? "Salvar" : "Registrar"}
                  </button>
                  {/* Altere o tipo do botão para "button" para evitar o submit */}
                  <button
                    className="FecharPr"
                    type="button" // Previna o comportamento de submit
                    onClick={handleClose}
                  >
                    Fechar
                  </button>
                </div>
              </form>
            </div>
          </Modal>

        </div>
      </main>
    </SideBarPage>
  );
}

export default Receitas;