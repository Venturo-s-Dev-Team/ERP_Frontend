import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
  FaTrash,
} from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";

const PedidosCancelados = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalGestao, setShowModalGestao] = useState(false);
  const [Clientes, setClientes] = useState([]);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  const handleShowGestao = () => setShowModalGestao(true);
  const handleCloseGestao = () => setShowModalGestao(false);
  const handleShowInfo = (venda) => {
    setSelectedVenda(venda);
    setShowModalInfo(true);
  };
  const handleCloseInfo = () => setShowModalInfo(false);

  // Função para exportar dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendas); // Converte os dados de vendas em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "venda"); // Adiciona a planilha ao livro
    XLSX.writeFile(wb, `venda_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Gestão de Pedidos</h3>
      </div>

      <div className="Button_Cad">
        <button onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>
      {/* Input de pesquisa */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar clientes..."
          value={searchTerm}
          className="SearchInput"
        />
      </div>
      <div className="Gestao-List">
        <table>
          <caption>Pedidos Cancelados</caption>
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>

              <th>Preço Final</th>
              <th>Status</th>
              <th>Info.</th>
            </tr>
          </thead>
          <tbody>
            {(venda) => (
              <tr key={venda.id_pedido}>
                <td>{venda.id_pedido}</td>
                <td>{venda.nome_cliente}</td>
                <td>{venda.total}</td>
                <td>{venda.Status}</td>
                <td>
                  <button
                    className="btn-ver-mais"
                    onClick={() => handleShowInfo(venda)}
                  >
                    Ver Mais
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para informações da venda */}
      <Modal
        style={{
          position: "fixed",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: 280,
          overflowY: "auto",
          borderRadius: 10,
          background: "#fff",
          boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.6)",
          border: "#000000d1",
        }}
        show={showModalInfo}
        onHide={handleCloseInfo}
      >
        <Modal.Header closeButton>
          <Modal.Title className="title-modal">
            Informações da Venda
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVenda ? (
            <div>
              <h4 className="h4-modal">
                Nome da Empresa: {selectedVenda.razaoSocial}
              </h4>
              <div className="textos-modal">
                <p>Código do pedido: {selectedVenda.id_pedido}</p>
                <p>Cliente: {selectedVenda.nome_cliente}</p>
                <p>Vendedor: {selectedVenda.vendedor}</p>
                <p>Desconto: {selectedVenda.desconto}</p>
                <p>Preço Final: {selectedVenda.total}</p>
              </div>
            </div>
          ) : (
            <p>Não há informações disponíveis.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseInfo}
            className="btn-fechar-modal"
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default PedidosCancelados;
