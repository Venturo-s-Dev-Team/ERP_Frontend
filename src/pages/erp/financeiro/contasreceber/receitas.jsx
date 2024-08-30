import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";

const receitas = [
  {
    id: 1,
    nome: "Venda 1",
    valor: 1.320,
    
  },
  {
    id: 2,
    nome: "Venda 2",
    valor: 1.320,
  },
  {
    id: 3,
    nome: "Venda 3",
    valor: 1.320,
  },
  {
    id: 4,
    nome: "Venda 4",
    valor: 1.320,
  },
];


function Receitas() {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Receitas</h3>
      </div>
        {/* Botões para cadastrar despesas, excluir ou editar */}
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
      {/* Div para tabela com a receita */}
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
                <td>{receita.nome}</td>
                <td>R$ {receita.valor.toFixed(2)}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
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
            <h1>Registrar de Receita</h1>
          </div>

          <form>    
            <input type="text" placeholder="Nome" />
            <input type="number" placeholder="Valor por Mês" />
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

export default Receitas;
