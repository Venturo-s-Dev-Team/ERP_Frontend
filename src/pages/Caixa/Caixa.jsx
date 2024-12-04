import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import "./caixa.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const Caixa = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalGestao, setShowModalGestao] = useState(false);
  const [newVenda, setNewVenda] = useState({
    razaoSocial: "",
    produtos: [],
    quantidade: "",
    desconto: "",
    precoFinal: "",
    tipoPagamento: "",
    vendedor: "",
  });

  const handleShowGestao = () => setShowModalGestao(true);
  const handleCloseGestao = () => setShowModalGestao(false);

  const handleCloseInfo = () => setShowModalInfo(false);

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

  // Função para carregar vendas do banco de dados
  useEffect(() => {
    if (userInfo && userInfo.id_EmpresaDb) {
      fetchVendas(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  const fetchVendas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/VendasEmAberto/${id}`, {
        withCredentials: true,
      });
      setVendas(response.data.InfoTabela);
    } catch (error) {
      console.error("Erro ao carregar vendas", error);
    }
  };

  // Função para lidar com mudanças nos campos de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVenda({ ...newVenda, [name]: value });
  };

  // Função para lidar com mudanças nos produtos
  const handleProductChange = (index, value) => {
    const produtos = [...newVenda.produtos];
    produtos[index] = value; // Atualiza o produto específico
    setNewVenda({ ...newVenda, produtos });
  };

  // Função para adicionar um novo produto
  const addProductInput = () => {
    setNewVenda({ ...newVenda, produtos: [...newVenda.produtos, ""] });
  };

  // Função para remover um produto
  const removeProductInput = (index) => {
    const produtos = newVenda.produtos.filter((_, i) => i !== index);
    setNewVenda({ ...newVenda, produtos });
  };

  // Função para registrar uma nova venda
  const handleRegisterVenda = async (e) => {
    e.preventDefault();
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    try {
      await axios.post(
        `/api/ServerTwo/tableVenda/${id}`,
        {
          ...newVenda,
          id_EmpresaDb: id,
          userId: userInfo.id_user,
          userName: userInfo.Nome_user,
        },
        { withCredentials: true }
      );

      fetchVendas(id); // Atualiza a lista de vendas
      handleCloseGestao();
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda.");
    }
  };

  // Processo de venda - Ajuste para passar um array, mesmo que seja um array com uma única venda
  const handleShowInfo = (venda) => {

    if (venda) {
      // Passa um array com a venda selecionada
      navigate("/caixa_Pagamentos", { state: { VendaSelecionada: [venda] } });
    } else {
      alert('Erro ao abrir venda');
      console.error('Venda não encontrada');
    }
  };


  // Função para exportar dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendas); // Converte os dados de vendas em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "venda"); // Adiciona a planilha ao livro
    XLSX.writeFile(wb, `venda_${new Date().toLocaleDateString()}.xlsx`);
  };


  return (
    <SideBarPage>
      <main >
        <div className="main-title">
          <h3>Pedidos Em Aberto no Caixa</h3>
        </div>

      <div className="scroll-despesas">
        <div className="Gestao-List">
          <table>
            <caption>Pedidos em Aberto</caption>
            <thead>
              <tr>
                <th>Id</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Iniciar Venda</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id_pedido}>
                  <td>{venda.id_pedido}</td>
                  <td>{venda.nome_cliente}</td>
                  <td>R$ {venda.total}</td>
                  <td>
                    <button
                      className="btn-abrir"
                      onClick={() => handleShowInfo(venda)}
                    >
                      Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para informações da venda */}
        <Modal
          style={{
            position: "fixed",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: 280,
            overflowY: "auto",
            borderRadius: 10,
            background: "#fff",
            boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.6)",
            border: "#000000d1",
          }}
          show={showModalInfo}
          onHide={handleCloseInfo}
        >
          <h1 className="titulo-temporario">Próxima Página!</h1>
        </Modal>

        </div>
      </main>
    </SideBarPage>
  );
};

export default Caixa;