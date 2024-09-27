import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import "./caixa_Pagamento.css";

const vendas = [
  { id: 1, name: "Bárbara", valor: 2143, condicao: "ATIVO" },
];

function Caixa_Pagamento() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // Estado para armazenar a opção selecionada

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymentChange = (paymentMethod) => {
    setSelectedPayment(paymentMethod); // Atualiza a opção selecionada
  };

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
        <div className="input-radio-caixa-card">
          {["À vista", "pix", "cartão", "permuta", "cheque"].map((method) => (
            <div className="input-radio-caixa" key={method}>
              <label>
                <input
                  type="radio"
                  value={method}
                  className="radio-caixa"
                  checked={selectedPayment === method}
                  onChange={() => handlePaymentChange(method)} // Atualiza a opção selecionada
                />
                {method.charAt(0).toUpperCase() + method.slice(1)} {/* Exibe a primeira letra maiúscula */}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="informacoes-caixa">
        <h2 className="titulo-informacoes-caixa">Informações</h2>
        <div>
          <p className="p-caixas">Cad. Cliente: João Araújo</p>
          <p className="p-caixas">PD (pedido): 108</p>
          <p className="p-caixas">Endereço: Rua Duque de Caixias, Centro</p>
          <p className="p-caixas">Bairro: Centro</p>
          <p className="p-caixas">Cidade: Nova Odessa</p>
          <input type="text" className="input-caixas-modal" placeholder="CPF/CNPJ"/>
        </div>
      </div>
    </main>
  );
}

export default Caixa_Pagamento;
