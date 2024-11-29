import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import { jwtDecode } from "jwt-decode";
import "./vendas.css";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from 'recharts';
import moment from 'moment'; // Para manipulação de datas
function Hist_vendas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [vendas, setVendas] = useState([]);
  const [dadosPorSemana, setDadosPorSemana] = useState([]);
  const [maxVendaMes, setMaxVendaMes] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
      const response = await axios.get(`/api/ServerOne/VendasConcluidas/${id}`, {
        withCredentials: true,
      });
      setVendas(response.data.InfoTabela);
      processarDadosPorSemana(response.data.InfoTabela); // Processa os dados para o gráfico
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
          String(venda.id_pedido).toLowerCase().includes(searchTerm.toLowerCase())
      );


      const processarDadosPorSemana = (vendas) => {
        const vendasPorSemana = {};
        let maxVenda = 0;
      
        vendas.forEach((venda) => {
          const semana = moment(venda.Data).week(); // Obtém a semana da data
          if (!vendasPorSemana[semana]) {
            vendasPorSemana[semana] = 0;
          }
      
          const totalVenda = parseFloat(venda.total); // Garantir que total seja um número
          if (!isNaN(totalVenda)) { // Verifica se o valor é um número válido
            vendasPorSemana[semana] += totalVenda;
          }
      
          if (vendasPorSemana[semana] > maxVenda) {
            maxVenda = vendasPorSemana[semana]; // Armazena a venda com maior valor
          }
        });
      
        const dadosFormatados = Object.keys(vendasPorSemana).map((semana) => ({
          name: `Semana ${semana}`,
          total: vendasPorSemana[semana],
        }));
      
        setMaxVendaMes(maxVenda); // Define o maior valor vendido no mês
        setDadosPorSemana(dadosFormatados); // Define os dados processados para o gráfico
      };
      
  return (
    <SideBarPage>
    <main className="main-container">
      <div className="main-title">
        <h3>Histórico de Vendas</h3>
      </div>
       {/* Botões para cadastrar despesas, excluir ou editar */}
       <div className="Button_Cad">
          <button>
            Exportar
            <FaFileExport />
          </button>
        </div>

          
 {/* Input de pesquisa */}
 <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "350px",
              }}
            >
              <BsSearch
                style={{ marginLeft: "10px", color: "#888", fontSize: "18px" }}
              />
              <input
                type="text" 
                placeholder="Pesquisar clientes..."
                value={searchTerm}
                onChange={handleSearchChange}
               
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #fff",
                  padding: "12px",
                  fontSize: "16px",
                  width: "300px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  paddingLeft: "10px",
                }}
              />
            </div>
        <div className="tabela-vendas">
        <table>
            <caption>Histórico de Vendas</caption>
            <thead>
              <tr>
                <th>Id</th>
                <th>Valor Total</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredvenda.map((venda) => (
                <tr key={venda.id_venda}>
                  <td>{venda.nome_cliente}</td>
                  <td>R$ {venda.total}</td>
                  <td>{venda.Data}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
    </main>
    </SideBarPage>
  );
}

export default Hist_vendas;
