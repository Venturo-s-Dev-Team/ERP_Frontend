import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../App.css";
import VenturoImg from "../../../images/Venturo.png";

const products = [
  { id: 1, name: "Produto 1", code: 232144, quantidade: 3, valorUni: 4, fornecedor: "X", tamanho: "Grande" },
  { id: 2, name: "Produto 2", code: 245, quantidade: 2, valorUni: 4.77, fornecedor: "X", tamanho: "Médio"},
  { id: 3, name: "Produto 3", code: 246, quantidade: 1, valorUni: 1, fornecedor: "X", tamanho:"Pequeno" },
];

function RegistroProduto() {
  const [showModal, setShowModal] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowInfo = (product) => {
    setSelectedProduct(product);
    setShowModalInfo(true);
  };

  const handleCloseInfo = () => {
    setSelectedProduct(null);
    setShowModalInfo(false);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Cadastrar Produto</h3>
      </div>

      <div className="Estoque_Cad">
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
        </div>

        <div className="Estoque_List">
          <table>
            <caption>Registro de Produtos</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Fornecedor</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
                <th>Info.</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.fornecedor}</td>
                  <td>{product.quantidade}</td>
                  <td>R$ {product.valorUni.toFixed(2)}</td>
                  <td>
                    <button className="ButtonInfoProduct" onClick={() => handleShowInfo(product)}>Abrir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          background: "linear-gradient(135deg, #ddd, silver)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={handleClose}
      >
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Registrar Produto</h1>
          </div>
          <form>
            <input type="number" placeholder="ID" />
            <input type="text" placeholder="Produto" />
            <input type="text" placeholder="Código" />
            <input type="number" placeholder="Quantidade" />
            <input type="text" placeholder="Preço por Unidade" />
            <div className="FooterButton">
              <button className="RegisterPr">Registrar</button>
              <button className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Informação do Produto */}
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
            <h1>Informação do Produto</h1>
          </div>

          {selectedProduct && (
            <div className="corpoInfoProduto" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li>
                  <img src={VenturoImg} alt="Imagem do Produto" className="ImagemInfoProduto" />
                </li>
                <li>
                  <strong>Nome:</strong> {selectedProduct.name}
                </li>
                <li>
                  <strong>Código:</strong> {selectedProduct.code}
                </li>
                <li>
                  <strong>Quantidade:</strong> {selectedProduct.quantidade}
                </li>
                <li>
                  <strong>Valor Unitário:</strong> R$ {selectedProduct.valorUni.toFixed(2)}
                </li>
                <li>
                  <strong>Fornecedor:</strong> {selectedProduct.fornecedor}
                </li>
                <li>
                  <strong>Tamanho:</strong> {selectedProduct.tamanho}
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

export default RegistroProduto;
