import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixa_Pagamentos.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const vendas = [{ id: 1, name: "Bárbara", valor: 2143, condicao: "ATIVO" }];

function Caixa_Pagamentos() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // Estado para armazenar a opção selecionada

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymentChange = (paymentMethod) => {
    setSelectedPayment(paymentMethod); // Atualiza a opção selecionada
  };
  return (
    <SideBarPage>
      <main>
        <div className="main-titleCxPagamentos">
          <h3>Caixa (Pagamentos)</h3>
        </div>
        <div className="main-CaixaPagamentos">
          <div className="Tabela-CxPagamentos">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Cliente</th>
                  <th>Valor</th>
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

          <div className="Card-CxPagamentos">
            <h2 className="TítuloCard-CxPagamentos">Formas de Pagamento</h2>

            <div className="InputRadio-CxPagamentos">
              {["À vista", "pix", "cartão", "permuta", "cheque"].map(
                (method) => (
                  <div className="DivInputs-CxPagamentos" key={method}>
                    <label>
                      <input
                        type="radio"
                        value={method}
                        className="Radio-CxPagamentos"
                        checked={selectedPayment === method}
                        onChange={() => handlePaymentChange(method)} // Atualiza a opção selecionada
                      />
                      {method.charAt(0).toUpperCase() + method.slice(1)}{" "}
                      {/* Exibe a primeira letra maiúscula */}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="Informações-CxPagamentos">
            <h2 className="TítulosInfo-CxPagamentos">Informações</h2>
            <div>
              <p className="p-CxPagamentos">Cad. Cliente: João Araújo</p>
              <p className="p-CxPagamentos">PD (pedido): 108</p>
              <p className="p-CxPagamentos">
                Endereço: Rua Duque de Caixias, Centro
              </p>
              <p className="p-CxPagamentos">Bairro: Centro</p>
              <p className="p-CxPagamentos">Cidade: Nova Odessa</p>
              <input
                type="text"
                className="InputCPF-CxPagamentos"
                placeholder="CPF/CNPJ"
              />
            </div>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Caixa_Pagamentos;
