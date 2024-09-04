import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import VenturoImg from "../../../../images/Venturo.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";

function Pagamentos() {
  const [showModal, setShowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedPagament, setSelectedPagament] = useState(null);
  const [pagaments, setPagaments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
          navigate('/login');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);

  // Função para buscar os pagamentos do banco de dados
  useEffect(() => {
    const fetchPagaments = async (id) => {
      try {
        const response = await axios.get(`/api/ServerOne/tablepagamentos/${id}`, { withCredentials: true });
        // Garantir que a resposta seja um array
        setPagaments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
        setPagaments([]); // Em caso de erro, garantir que pagaments seja um array
      }
    };   

    // Só buscar pagamentos se userInfo estiver definido
    if (userInfo && userInfo.id_user) {
      fetchPagaments(userInfo.id_user);
    }
  }, [userInfo]); // Dependência adicionada para garantir que o efeito seja reexecutado quando userInfo mudar

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

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Pagamentos Programados</h3>
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

      <div className="Estoque_List">
        <table>
          <caption>Lista de Pagamentos</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Info.</th>
            </tr>
          </thead>
          <tbody>
            {pagaments.map((pagament) => (
              <tr key={pagament.id}>
                <td>{pagament.name}</td>
                <td>{pagament.valor}</td>
                <td>{pagament.data}</td>
                <td>{pagament.conta}</td>
                <td>{pagament.tipo}</td>
                <td>
                  <button className="ButtonInfoProduct" onClick={() => handleShowInfo(pagament)}>Abrir</button>
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
            <h1>Registrar Pagamento</h1>
          </div>
          <form>
            <input type="number" placeholder="ID" />
            <input type="text" placeholder="Nome" />
            <input type="text" placeholder="Valor" />
            <input type="date" placeholder="Data" />
            <input type="text" placeholder="Conta" />
            <input type="text" placeholder="Tipo" />
            <div className="FooterButton">
              <button className="RegisterPr">Registrar</button>
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
          background: "linear-gradient(135deg, #ddd, white)",
          boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.6)",
        }}
        show={showModalInfo}
        onHide={handleCloseInfo}
      >
        <div className="DivModalCont" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="HeaderModal">
            <h1>Informação do beneficiário</h1>
          </div>

          {selectedPagament && (
            <div className="corpoInfoProduto" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                  <img src={VenturoImg} alt="Imagem do Produto" className="ImagemInfoProduto" />
                </li>
                <li>
                  <strong>Nome:</strong> {selectedPagament.name}
                </li>
                <li>
                  <strong>Valor:</strong> R$ {selectedPagament.valor}
                </li>
                <li>
                  <strong>Data:</strong> {selectedPagament.data}
                </li>
                <li>
                  <strong>Conta:</strong> {selectedPagament.conta}
                </li>
                <li>
                  <strong>Tipo:</strong> {selectedPagament.tipo}
                </li>
              </ul>
            </div>
          )}

          <div className="FooterButton">
            <button className="FecharPr" onClick={handleCloseInfo}>
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

export default Pagamentos;
