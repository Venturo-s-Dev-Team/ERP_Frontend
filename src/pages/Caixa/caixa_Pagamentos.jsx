import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InputMask from 'react-input-mask';
import { useLocation, useNavigate } from "react-router-dom";
import "./caixa_Pagamentos.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Caixa_Pagamentos() {
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
    if (paymentMethod === "À vista") {
    setSelectedPayment(paymentMethod);
  } else {
    alert("Esta forma de pagamento está sendo desenvolvida")
  }
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
    <SideBarPage>
      <main>
        <div className="main-titleCxPagamentos">
          <h3>Caixa (Pagamentos)</h3>
        </div>

        <div className="scroll-despesas">
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

            <div className="Card-CxPagamentos">
              <h2 className="TítuloCard-CxPagamentos">Formas de Pagamento</h2>

              <div className="InputRadio-CxPagamentos">
              {["À vista", "pix", "cartão", "permuta", "cheque"].map((method) => (
            <div className="DivInputs-CxPagamentos"  key={method}>
              <label>
                <input
                  type="radio"
                  value={method}
                  className="Radio-CxPagamentos"
                  checked={selectedPayment === method}
                  onChange={() => handlePaymentChange(method)}
                />
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </label>
            </div>
          ))}
              </div>
            </div>

            <div className="Informações-CxPagamentos">
              <h2 className="TítulosInfo-CxPagamentos">Informações</h2>
              {selectedCliente ? (
          <div>
            <p className="p-CxPagamentos">Cad. Cliente: {selectedCliente.razao_social}</p>
            <p className="p-CxPagamentos">PD (pedido): {VendaSelected[0]?.id_pedido}</p>
            <p className="p-CxPagamentos">Endereço: {selectedCliente.endereco}</p>
            <p className="p-CxPagamentos">Bairro: {selectedCliente.bairro}</p>
            <p className="p-CxPagamentos">Cidade: {selectedCliente.cidade}</p>
          </div>
        ) : (
          <p>Carregando informações do cliente...</p>
        )}
        <InputMask
          type="text"
          className="InputCPF-CxPagamentos"
          placeholder="CPF/CNPJ"
          value={cpf_cnpj}
          onChange={handleCpfCnpjChange}
        />
      </div>
      <div className="Button_Cad">
        <button onClick={handleProsseguir}>
        Prosseguir
      </button>
      </div>
          </div>
    

      </main>
    </SideBarPage>
  );
}

export default Caixa_Pagamentos;
