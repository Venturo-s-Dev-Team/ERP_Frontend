import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../App.css";
import Venturo from "../../../images/Venturo.png";

const products = [
  { id: 1, name: "Produto 1", code: 244, quantidade: 3, valorUni: 4 },
  { id: 2, name: "Produto 2", code: 245, quantidade: 2, valorUni: 4.77 },
  { id: 3, name: "Produto 3", code: 246, quantidade: 1, valorUni: 1 },
];

function RegistroProduto() {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
                <th>Código</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.code}</td>
                  <td>{product.quantidade}</td>
                  <td>R$ {product.valorUni.toFixed(2)}</td>
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
          boxShadow: "10 20px 30px rgba(0, 0, 0, 0.9)",
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
    </main>
  );
}

export default RegistroProduto;
