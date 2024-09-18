import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
} from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx";
import "../../../App.css";

const GestaoVendas = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalGestao, setShowModalGestao] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [newVenda, setNewVenda] = useState({
    razaoSocial: "",
    produto: "",
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
    }
  }, [userInfo]);

  const fetchVendas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableVendas/${id}`, {
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
        <button className="Button-Menu" onClick={handleShowGestao}>
          Adicionar
          <FaPlus />
        </button>
        <button className="Button-Menu">
          Editar
          <FaPenToSquare />
        </button>
        <button className="Button-Menu">
          Excluir
          <FaTrashCan />
        </button>
        <button className="Button-Menu" onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>

      <div className="Gestao-List">
        <table>
          <caption>Registro de Pedidos</caption>
          <thead>
            <tr>
              <th>Razão Social</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Desconto</th>
              <th>Preço Final</th>
              <th>Forma de Pagamento</th>
              <th>Garantia</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.nome_cliente}</td>
                <td>{venda.produto}</td>
                <td>{venda.quantidade}</td>
                <td>{venda.desconto}</td>
                <td>{venda.total}</td>
                <td>{venda.forma_pagamento}</td>
                <td>{venda.garantia}</td>
                <td>{venda.vendedor}</td>
                <td>
                  <button
                    className="btn-ver-mais"
                    onClick={() => handleShowInfo(venda)}
                  >
                    Ver Mais
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
                <p>Código da Venda: {selectedVenda.codigo}</p>
                <p>Descrição: {selectedVenda.descricao}</p>
                <p>Preço: {selectedVenda.preco}</p>
                <p>Preço Bruto: {selectedVenda.precoBruto}</p>
                <p>Preço Final: {selectedVenda.precoFinal}</p>
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

      {/* Modal para registro de nova venda */}
      <Modal
        style={{
          position: "fixed",
          top: "50%",
          bottom: 0,
          left: "50%",
          right: 0,
          zIndex: 1000,
          width: "80%",
          height: "83%",
          borderRadius: 20,
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(135deg, #fff, #fff)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModalGestao}
        onHide={handleCloseGestao}
      >

<div className="DivModalCont">
            <h1>Registrar Cliente (CPF)</h1>
            <form >
            <input
            placeholder="Razão Social"
                  type="text"
                  name="razaoSocial"
                  value={newVenda.razaoSocial}
                  onChange={handleChange}
                  required
                />
              </form>
              </div>
        <div style={{ padding: 20 }}>
          <div className="formulario">
            {/* Emitente */}
            <div className="emitente">
              <h5 className="mini-titulo-nf"> Emitente </h5>

              {/* Emitente - razão social */}
              <div className="razao-social">
                <label className="letras-nf">Razão Social:</label>
                <input
                  className="input-nf"
                  type="text"
                  name="razaoSocial"
                  value={newVenda.razaoSocial}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Produto */}
              <div className="produto">
                <label className="letras-nf">Produto:</label>
                <input
                  className="input-nf"
                  type="text"
                  name="produto"
                  value={newVenda.produto}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quantidade */}
              <div className="quantidade">
                <label className="letras-nf">Quantidade:</label>
                <input
                  className="input-nf"
                  type="number"
                  name="quantidade"
                  value={newVenda.quantidade}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Desconto */}
              <div className="desconto">
                <label className="letras-nf">Desconto:</label>
                <input
                  className="input-nf"
                  type="number"
                  name="desconto"
                  value={newVenda.desconto}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Preço Final */}
              <div className="preco-final">
                <label className="letras-nf">Preço Final:</label>
                <input
                  className="input-nf"
                  type="number"
                  name="precoFinal"
                  value={newVenda.precoFinal}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tipo de Pagamento */}
              <div className="tipo-pagamento">
                <label className="letras-nf">Tipo de Pagamento:</label>
                <input
                  className="input-nf"
                  type="text"
                  name="tipoPagamento"
                  value={newVenda.tipoPagamento}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Vendedor */}
              <div className="vendedor">
                <label className="letras-nf">Vendedor:</label>
                <input
                  className="input-nf"
                  type="text"
                  name="vendedor"
                  value={newVenda.vendedor}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button className="button-registrar" onClick={handleRegisterVenda}>
                Registrar Venda
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default GestaoVendas;
