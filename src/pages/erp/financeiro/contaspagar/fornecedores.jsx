import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";

const products = [
  { id: 1, name: "Fornecedor 1", cnpj: 21343, endereco: 3, },
  { id: 2, name: "Fornecedor 2", cnpj: 12311, endereco: 2, },
  { id: 3, name: "Fornecedor 3", cnpj: 123232, endereco: 1, },
];

function Fornecedores() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3> Forncedores</h3>
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
            <caption>Listagem de fornecedores</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.cnpj}</td>
                  <td>{product.endereco}</td>
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
          background: "white",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={handleClose}
      >
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Registrar Fornecedor</h1>
          </div>

          <form>
            <input type="number" placeholder="ID" />
            <input type="text" placeholder="Forncedor" />
            <input type="CNPJ" placeholder="CNPJ" />
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

export default Fornecedores;
