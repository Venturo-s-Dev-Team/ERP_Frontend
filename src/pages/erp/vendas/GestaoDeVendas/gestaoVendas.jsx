import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
  FaTrash,
} from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import Abas from "./Abas"
import "./gestaoVendas.css";

const GestaoVendas = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalGestao, setShowModalGestao] = useState(false);
  const [Clientes, setClientes] = useState([]);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
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
  const handleShowInfo = (venda) => {
    setSelectedVenda(venda);
    setShowModalInfo(true);
  };
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
      fetchDadosClientes(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  const fetchDadosClientes = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableCliente/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
    }
  };

  const fetchVendas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableVenda/${id}`, {
        withCredentials: true,
      });
      setVendas(response.data.InfoTabela);
    } catch (error) {
      console.error("Erro ao carregar vendas", error);
    }
  };

    // Filtro dos produtos
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
    };
  
    const filteredvenda = vendas.filter(
      (venda) =>
        venda.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(venda.id_pedido).toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  // PARA EDITAR
  const handleShowEdit = (venda) => {
    if (venda.Status === "CANCELADA" || "VENDA CONCLUÍDA") {
      alert("Esta venda não está em aberto para edições")
    } else if (venda) {
      setSelectedVenda(venda);
      navigate("/AbasForUpdate", {
        state: {
          VendaForUpdate: venda, // Verifique se 'venda' não está nulo
        },
      });
    } else {
      console.error("Nenhuma venda selecionada.");
    }
  };

// Função para cancelar uma venda
const CancelarVenda = async (venda) => {

  if(venda.Status != "EM ABERTO") {
    alert('Este pedido não pode ser cancelado')
  } else {
  const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

  console.log("Enviando CancelarVenda com dados:", {
    id_pedido: venda.id_pedido,
    produto: venda.produto,
  });

  try {
    await axios.put(
      `/api/ServerTwo/CancelarVenda/${id}`,
      {
        id_pedido: venda.id_pedido,
        produto: venda.produto, // Enviar diretamente como array
      },
      { withCredentials: true }
    );

    fetchVendas(id); // Atualiza a lista de vendas
    handleCloseGestao();
    alert("Venda cancelada com sucesso!");
  } catch (error) {
    console.error("Erro ao cancelar venda:", error);
    alert("Erro ao cancelar venda.");
  }}
};


  // Função para exportar dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendas); // Converte os dados de vendas em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "venda"); // Adiciona a planilha ao livro
    XLSX.writeFile(wb, `venda_${new Date().toLocaleDateString()}.xlsx`);
  };
  
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Gestão de Pedidos</h3>
      </div>

      <div className="Button_Cad">
        <button onClick={() => navigate("/abas")}>
          Adicionar
          <FaPlus />
        </button>
        <button
            className="Button-Menu"
            onClick={() => handleShowEdit(selectedVenda)}
          >
            Editar
            <FaPenToSquare />
          </button>
          <button
            className="Button-Menu"
            onClick={() => CancelarVenda(selectedVenda)}
          >
            Cancelar
            <FaPenToSquare />
          </button>
        <button  onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>
                    {/* Input de pesquisa */}
                    <div>
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="SearchInput"
          />
        </div>
      <div className="Gestao-List">
        <table>
          <caption>Registro de Pedidos</caption>
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Preço Final</th>
              <th>Status</th>
              <th>Info.</th>
              <th>Selecionar</th>
            </tr>
          </thead>
          <tbody>
            {filteredvenda.map((venda) => (
              <tr key={venda.id_pedido}>
                <td>{venda.id_pedido}</td>
                <td>{venda.nome_cliente}</td>
                <td>{venda.total}</td>
                <td>{venda.Status}</td>
                <td>
                  <button
                    className="btn-ver-mais"
                    onClick={() => handleShowInfo(venda)}
                  >
                    Ver Mais
                  </button>
                </td>
                <td>
                    <label className="custom-radio">
                      <input
                        type="radio"
                        name="selectedProduct"
                        value={venda.id}
                        onChange={() => setSelectedVenda(venda)}
                      />
                      <span className="radio-checkmark"></span>
                    </label>
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
        <Modal.Header closeButton>
          <Modal.Title className="title-modal">
            Informações da Venda
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVenda ? (
            <div>
              <h4 className="h4-modal">
                Nome da Empresa: {selectedVenda.razaoSocial}
              </h4>
              <div className="textos-modal">
                <p>Código do pedido: {selectedVenda.id_pedido}</p>
                <p>Cliente: {selectedVenda.nome_cliente}</p>
                <p>Vendedor: {selectedVenda.vendedor}</p>
                <p>Desconto: {selectedVenda.desconto}</p>
                <p>Preço Final: {selectedVenda.total}</p>
              </div>
            </div>
          ) : (
            <p>Não há informações disponíveis.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseInfo}
            className="btn-fechar-modal"
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default GestaoVendas;
