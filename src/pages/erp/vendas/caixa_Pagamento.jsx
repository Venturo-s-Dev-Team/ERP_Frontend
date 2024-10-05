import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import "./caixa_Pagamento.css";

function Caixa_Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { VendaSelecionada } = location.state || {};
  const [userInfo, setUserInfo] = useState({});
  const [selectedCliente, setSelectedCliente] = useState('');
  const [cpf_cnpj, setCpfCnpj] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const VendaSelected = Array.isArray(VendaSelecionada) ? VendaSelecionada : [];

  // Verifica o token JWT
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });
        if (typeof response.data.token === "string") {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/login");
      }
    };
    verifyToken();
  }, [navigate]);

  // Carrega os dados do cliente
  useEffect(() => {
    if (userInfo && userInfo.id_EmpresaDb && VendaSelected.length > 0) {
      fetchCliente(userInfo.id_EmpresaDb, VendaSelected[0]?.nome_cliente);
    }
  }, [userInfo, VendaSelected]);

  const fetchCliente = async (id, nomeCliente) => {
    try {
      const response = await axios.get(`/api/ServerOne/SelectedCliente/${id}`, {
        params: { razao_social: nomeCliente },
        withCredentials: true,
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        setSelectedCliente(response.data[0]);
        setCpfCnpj(response.data[0].cpf_cnpj || ''); // Atualiza o CPF/CNPJ apenas se estiver vazio
      }
    } catch (error) {
      console.error("Erro ao carregar cliente", error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handlePaymentChange = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
  };

  const handleCpfCnpjChange = (event) => {
    setCpfCnpj(event.target.value); // Permitir alteração no campo de CPF/CNPJ quando estiver vazio
  };

  const handleProsseguir = () => {
    if (selectedPayment === "À vista") {
      // Passa os dados necessários para a próxima página
      navigate("/caixa_modal", {
        state: {
          VendaSelecionada: VendaSelected,
          selectedCliente,
          selectedPayment,
          cpf_cnpj,
        },
      });
    }
  };

  return (
    <main className="main-container">
      {/* Tabela de vendas */}
      <div className="tabela-vendas">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {VendaSelected.map((venda) => (
              <tr key={venda.id_pedido}>
                <td>{venda.id_pedido}</td>
                <td>{venda.nome_cliente}</td>
                <td>R$ {venda.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seção de formas de pagamento */}
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
                  onChange={() => handlePaymentChange(method)}
                />
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Informações do cliente */}
      <div className="informacoes-caixa">
        <h2 className="titulo-informacoes-caixa">Informações</h2>
        {selectedCliente ? (
          <div>
            <p className="p-caixas">Cad. Cliente: {selectedCliente.razao_social}</p>
            <p className="p-caixas">PD (pedido): {VendaSelected[0]?.id_pedido}</p>
            <p className="p-caixas">Endereço: {selectedCliente.endereco}</p>
            <p className="p-caixas">Bairro: {selectedCliente.bairro}</p>
            <p className="p-caixas">Cidade: {selectedCliente.cidade}</p>
          </div>
        ) : (
          <p>Carregando informações do cliente...</p>
        )}
        <input
          type="text"
          className="input-caixas-modal"
          placeholder="CPF/CNPJ"
          value={cpf_cnpj}
          onChange={handleCpfCnpjChange}
          disabled={cpf_cnpj !== ''} // Bloqueia o campo se o CPF/CNPJ estiver preenchido
        />
      </div>

      <button className="btn-caixa" onClick={handleProsseguir}>
        Prosseguir
      </button>
    </main>
  );
}

export default Caixa_Pagamento;