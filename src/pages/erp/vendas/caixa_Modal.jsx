import React, {useState, useEffect} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import "./caixa_Modal.css";

function Caixa_Modal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { VendaSelecionada, selectedCliente, selectedPayment, cpf_cnpj } = location.state || {};
  const [userInfo, setUserInfo] = useState({});

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

  const [valorRecebido, setValorRecebido] = useState(""); // Estado para o valor recebido
  const [troco, setTroco] = useState(0); // Estado para o troco

  // Função para calcular o troco
  const calcularTroco = (valor) => {
    const recebido = parseFloat(valor);
    if (!isNaN(recebido)) {
      setTroco(recebido - VendaSelecionada[0]?.total); // Calcula a diferença entre o recebido e o valor total
    } else {
      setTroco(0); // Se o valor recebido não for válido, o troco é 0
    }
  };

  // Atualiza o valor recebido e recalcula o troco
  const handleValorRecebidoChange = (e) => {
    const novoValorRecebido = e.target.value;
    setValorRecebido(novoValorRecebido);
    calcularTroco(novoValorRecebido);
  };


   // Função para enviar os dados para o backend
   const handleSubmit = async () => {
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    console.log(id)
    try {
      const response = await axios.put(`/api/ServerTwo/RegisterVenda/${VendaSelecionada[0].id_pedido}`, 
        {formData: JSON.stringify({
        cpf_cnpj: cpf_cnpj,
        forma_pagamento: selectedPayment,
        valor_total: VendaSelecionada[0]?.total,
        selectedCliente,
        id: parseInt(id)
      }),},
       { withCredentials: true });

       if ( response.status === 200) {
        alert('Venda concluída');
        navigate("/caixa")
       }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao atualizar a venda.");
    }
  };



  return (
    <main className="main-container">
      <div className="valor-caixa">
        <h1>Valor Total: R$ {VendaSelecionada[0]?.total || '0,00'}</h1>
      </div>

      <div className="valor-caixa">
      <div className="valor-caixa">
        <input
          type="number"
          className="input-caixas-modal"
          placeholder="Digite o valor recebido"
          value={valorRecebido}
          onChange={handleValorRecebidoChange}
        />
        </div>
        <h2 className="caixa-modal-h">Troco: R$ {troco >= 0 ? troco.toFixed(2) : "0.00"}</h2>
      </div>

      <div className="informacoes-caixa-modal">
        <p>Cliente: {selectedCliente.razao_social}</p>
        <p>CPF/CNPJ: {cpf_cnpj}</p>
        <p>Forma de pagamento: {selectedPayment}</p>
      </div>
      <button className="btn-caixa" onClick={handleSubmit}>Finalizar</button>
    </main>
  );
}

export default Caixa_Modal;
