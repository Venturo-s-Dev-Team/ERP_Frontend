import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixa_Modal.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import { useLocation, useNavigate } from "react-router-dom";

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
    const recebido = parseFloat(valorRecebido);

    // Verifica se o valor recebido é vazio, não é um número ou é menor que o total da venda
    if (isNaN(recebido) || recebido < VendaSelecionada[0]?.total) {
      alert("O valor recebido é inválido ou menor do que o valor da compra.");
    } else {
      try {
        const response = await axios.put(`/api/ServerTwo/RegisterVenda/${VendaSelecionada[0].id_pedido}`,
          {
            formData: JSON.stringify({
              cpf_cnpj: cpf_cnpj,
              forma_pagamento: selectedPayment,
              valor_total: VendaSelecionada[0]?.total,
              selectedCliente,
              nome_cliente: selectedCliente.razao_social,
              DataExpiracao: selectedCliente.dia_para_faturamento,
              id: parseInt(id),
              userId: (userInfo.id_user),
              userName: userInfo.Nome_user
            }),
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert('Venda concluída');
          navigate("/caixa");
        }
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        alert("Erro ao efetuar a venda.");
      }
    }
  };


  return (
    <SideBarPage>
      <main>
        <div className="main-titleCxModal">
          <h3>Caixa (Modal)</h3>
        </div>

        <div className="scroll-despesas">
          <div className="Valor-CxModal">
            <h1>Valor Total: R$ {VendaSelecionada[0]?.total || '0,00'}</h1>
          </div>

          <div className="Valor-CxModal">
            <input
              type="number"
              className="Input-CxModal"
              placeholder="Digite o valor recebido"
              value={valorRecebido}
              onChange={handleValorRecebidoChange}
            />
            <h2 className="H2-CxModal">Troco: R$ {troco >= 0 ? troco.toFixed(2) : "0.00"}</h2>
          </div>

          <div>
            <p>Cliente: {selectedCliente.razao_social}</p>
            <p>CPF/CNPJ: {cpf_cnpj}</p>
            <p>Forma de pagamento: {selectedPayment}</p>
          </div>
          <button className="Btn-CxModal" onClick={handleSubmit} >Finalizar</button>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Caixa_Modal;