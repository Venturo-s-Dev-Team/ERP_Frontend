import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
  FaTrash,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./gestaoVendas.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const GestaoVendas = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalGestao, setShowModalGestao] = useState(false);
  const [Clientes, setClientes] = useState([]);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [newVenda, setNewVenda] = useState({
    razaoSocial: "",
    produtos: [],
    quantidade: "",
    desconto: "",
    precoFinal: "",
    tipoPagamento: "",
    vendedor: "",
  });

  const handleShowGestao = () => setShowModalGestao(true);
  const handleCloseGestao = () => setShowModalGestao(false);
  const handleShowInfo = (venda) => {
    setSelectedVenda(venda);
    setShowModalInfo(true);
  };
  const handleCloseInfo = () => setShowModalInfo(false);

  return (
    <SideBarPage>
      <main>
        <div>
          <h3>Gestão de Pedidos</h3>
        </div>

        <div className="Button_Cad">
          <button onClick={() => navigate("/abas")}>
            Adicionar
            <FaPlus />
          </button>
          <button
            className="Button-Menu"
            onClick={() => handleShowEdit(selectedVenda)}
          >
            Editar
            <FaPenToSquare />
          </button>
          <button
            className="Button-Menu"
            onClick={() => CancelarVenda(selectedVenda)}
          >
            Cancelar
            <FaPenToSquare />
          </button>
          <button>
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
            <caption>Registro de Pedidos</caption>
            <thead>
              <tr>
                <th>Id</th>
                <th>Cliente</th>
                <th>Preço Final</th>
                <th>Status</th>
                <th>Info.</th>
                <th>Selecionar</th>
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
                  <td>
                    <label className="custom-radio">
                      <input
                        type="radio"
                        name="selectedProduct"
                        value={venda.id}
                        onChange={() => setSelectedVenda(venda)}
                      />
                      <span className="radio-checkmark"></span>
                    </label>
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
    </SideBarPage>
  );
};

export default GestaoVendas;
