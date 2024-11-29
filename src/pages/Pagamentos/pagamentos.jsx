import React, { useState, useEffect } from "react";
import "./pagamentos.css";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaFileExport } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import * as XLSX from "xlsx";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Pagamentos() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedPagament, setSelectedPagament] = useState(null);
  const [pagaments, setPagaments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [newPagament, setNewPagament] = useState({
    Nome: "",
    Valor: "",
    Data: "",
    Conta: "",
    TipoPagamento: "",
    Descricao: "",
  });

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get("/api/ServerTwo/verifyToken", {
        withCredentials: true,
      });
      if (typeof response.data.token === "string") {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } else {
        console.error("Token não é uma string:", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Token inválido", error);
      navigate("/login");
    }
  };

    // Função para carregar vendas do banco de dados
    useEffect(() => {
      fetchPagamentos()
    }, []);
  
  
    const fetchPagamentos= async () => {
      try {
        const response = await axios.get(`/api/ServerOne/tablepagamentos`, {
          withCredentials: true,
        });
        setPagaments(response.data.InfoTabela);
      } catch (error) {
        console.error("Erro ao carregar pagamentos: ", error);
      }
    };
  

  // Mostrar e fechar modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowInfo = (pagament) => {
    setSelectedPagament(pagament);
    setShowModalInfo(true);
  };

  const handleCloseInfo = () => {
    setSelectedPagament(null);
    setShowModalInfo(false);
  };

  // Função para exportar pagamentos para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pagaments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagamentos");
    XLSX.writeFile(workbook, "PagamentosProgramados.xlsx");
  };

  const registerPagament = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/api/ServerTwo/registrarPagamento`,
        {
          ...newPagament,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPagaments((prev) => [...prev, response.data]);
        handleClose();
        setNewPagament({
          Nome: "",
          Valor: "",
          Data: "",
          Conta: "",
          TipoPagamento: "",
          Descricao: "",
        });
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
    }
  };

  // Função para lidar com mudanças nos inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPagament((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Pagamentos Programados</h3>
        </div>

        <div className="scroll-despesas">
          <div className="Button_Cad">
            <button onClick={handleShow}>
              Adicionar
              <FaPlus />
            </button>
            <button>
              Editar
              <FaPenToSquare />
            </button>
            <button onClick={exportToExcel}>
              Exportar
              <FaFileExport />
            </button>
          </div>

          <div className="Estoque_List">
            <table>
              <caption>Lista de Pagamentos</caption>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor</th>
                  <th>Conta</th>
                  <th>Info.</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {pagaments.map((pagament) => (
                  <tr key={pagament.id}>
                    <td>{pagament.Nome}</td>
                    <td>{pagament.Valor}</td>
                    <td>{pagament.Conta}</td>

                    <td>
                      <button
                        className="Btn-Abrir"
                        onClick={() => handleShowInfo(pagament)}
                      >
                        Abrir
                      </button>
                    </td>
                    <label className="custom-radio">
                    <input
                      type="radio"
                      name="selectedPagament"
                      onChange={() => setSelectedPagament(pagament)}
                      checked={selectedPagament?.id === pagament.id}
                    />
                    <span className="radio-checkmark"></span>
                        </label>
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
              left: "55%",
              right: 0,
              zIndex: 1000,
              padding: 40,
              width: "55%",
              height: "63%",
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
                <h1>Registrar Pagamento</h1>
              </div>
              <form onSubmit={registerPagament}>
                <input
                  type="text"
                  name="Nome"
                  placeholder="Nome"
                  value={newPagament.Nome}
                  onChange={handleChange}
                  className="Input-Modal"
                  required
                />
                <input
                  type="text"
                  name="Valor"
                  placeholder="Valor"
                  value={newPagament.Valor}
                  onChange={handleChange}
                  className="Input-Modal"
                  required
                />
                <input
                  type="date"
                  name="Data"
                  placeholder="Data"
                  value={newPagament.Data}
                  onChange={handleChange}
                  className="Input-Modal"
                  required
                />
                <InputMask
                mask="999999999999"
                  type="text"
                  name="Conta"
                  placeholder="Conta"
                  value={newPagament.Conta}
                  onChange={handleChange}
                  className="Input-Modal"
                />
                <input
                  type="text"
                  name="TipoPagamento"
                  placeholder="Tipo de pagamento"
                  value={newPagament.TipoPagamento}
                  onChange={handleChange}
                  className="Input-Modal"
                  required
                />
                <input
                  type="text"
                  name="Descricao"
                  placeholder="Descrição"
                  value={newPagament.Descricao}
                  onChange={handleChange}
                  className="Input-Modal"
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

          <Modal
            style={{
              position: "fixed",
              top: "50%",
              bottom: 0,
              left: "50%",
              right: 0,
              zIndex: 1000,
              width: "70%",
              height: "93%",
              borderRadius: 10,
              transform: "translate(-50%, -50%)",
              background: "white",
              boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.6)",
            }}
            show={showModalInfo}
            onHide={handleCloseInfo}
          >
            <div
              className="DivModalCont"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div className="HeaderModal">
                <h1>Informação do beneficiário</h1>
              </div>

              {selectedPagament && (
                <div
                  className="corpoInfoProduto"
                  style={{ overflowY: "auto", flex: 1, padding: "20px" }}
                >
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>
                      <strong>Nome:</strong> {selectedPagament.Nome}
                    </li>
                    <li>
                      <strong>Valor:</strong> R$ {selectedPagament.Valor}
                    </li>
                    <li>
                      <strong>Data:</strong> {selectedPagament.Data}
                    </li>
                    <li>
                      <strong>Conta:</strong> {selectedPagament.Conta}
                    </li>
                    <li>
                      <strong>Tipo:</strong> {selectedPagament.TipoPagamento}
                    </li>
                    <li>
                      <strong>Descrição:</strong> {selectedPagament.Descricao}
                    </li>
                  </ul>
                </div>
              )}

              <div>
                <button className="FecharPr" onClick={handleCloseInfo}>
                  Fechar
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Pagamentos;
