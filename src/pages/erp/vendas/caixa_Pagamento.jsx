import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";


const vendas = [
  { id: 1, name: "Bárbara", valor: 2143, condicao: "ATIVO", },
  { id: 2, name: "Mariana", valor: 1311, condicao: "ATIVO",},
  { id: 3, name: "José", valor: 1232, condicao: "ATIVO", },
];

function Caixa_Pagamento() {

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <main className="main-container">
      
        <div className="tabela-vendas">
        <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Condição</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id}>
                    <td>{venda.id}</td>
                  <td>{venda.name}</td>
                  <td>R$ {venda.valor.toFixed(2)}</td>
                  <td>{venda.condicao}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Parte dos Pagamentos */}
          <div className="card_caixa">
            <h2 className="card_caixa-titulo">Formas de Pagamento</h2>
            <div class="card">
  <h3>Escolha uma Opção</h3>
  <div class="radio-group">
    <label class="custom-radio">
      <input type="radio" name="option" value="1" />
      <span class="radio-btn"></span>
      Opção 1
    </label>
    <label class="custom-radio">
      <input type="radio" name="option" value="2" />
      <span class="radio-btn"></span>
      Opção 2
    </label>
    <label class="custom-radio">
      <input type="radio" name="option" value="3" />
      <span class="radio-btn"></span>
      Opção 3
    </label>
    <label class="custom-radio">
      <input type="radio" name="option" value="4" />
      <span class="radio-btn"></span>
      Opção 4
    </label>
    <label class="custom-radio">
      <input type="radio" name="option" value="5" />
      <span class="radio-btn"></span>
      Opção 5
    </label>
  </div>
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
            <h1>Registrar Venda</h1>
          </div>

          <form>            
            <input type="text" placeholder="Nome" />
            <input type="number" placeholder="Valor" />
            <input type="text" placeholder="Data" />
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

export default Caixa_Pagamento;
