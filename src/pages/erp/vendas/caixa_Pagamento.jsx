import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Removi as chaves do jwtDecode
import { useLocation, useNavigate } from "react-router-dom";
import "./caixa_Pagamento.css";

function Caixa_Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { VendaSelecionada } = location.state || {}; // Verifica se o state existe
  const [userInfo, setUserInfo] = useState({});
  const [selectedCliente, setSelectedCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // Estado para armazenar a opção selecionada

  // Verifica se o array está vazio ou indefinido
  const VendaSelected = Array.isArray(VendaSelecionada) ? VendaSelecionada : [];

  // Função para verificar o token
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
          console.error("Token não é uma string:", response.data.token);
          navigate("/");
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  // Função para carregar os dados do cliente do banco de dados
  useEffect(() => {
    if (userInfo && userInfo.id_EmpresaDb && VendaSelected.length > 0) {
      // Verifica se há vendas selecionadas
      fetchCliente(userInfo.id_EmpresaDb, VendaSelected[0]?.nome_cliente);
      console.log(selectedCliente);
    }
  }, [userInfo, VendaSelected]);

  const fetchCliente = async (id, nomeCliente) => {
    try {
      const response = await axios.get(`/api/ServerOne/SelectedCliente/${id}`, {
        params: { razao_social: nomeCliente }, // Envia como query string o nome do cliente
        withCredentials: true,
      });
      // Verifica se os dados foram retornados como um array e seleciona o primeiro elemento
    if (Array.isArray(response.data) && response.data.length > 0) {
      setSelectedCliente(response.data[0]); // Acessa o primeiro item do array
      console.log(response.data[0]); // Verifica no console o dado acessado
    } else {
      console.error("Cliente não encontrado ou formato de dados incorreto");
    }
      console.log("Cliente encontrado:", response.data);
    } catch (error) {
      console.error("Erro ao carregar cliente", error);
    }
  };

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
                {method.charAt(0).toUpperCase() + method.slice(1)}{" "}
                {/* Exibe a primeira letra maiúscula */}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="informacoes-caixa">
        <h2 className="titulo-informacoes-caixa">Informações</h2>
        {selectedCliente ? ( // Exibe os dados do cliente se encontrado
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
          value={selectedCliente.cpf_cnpj}
        />
      </div>
    </main>
  );
}

export default Caixa_Pagamento;