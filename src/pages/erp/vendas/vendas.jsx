import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./vendas.css";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Area, Bar } from 'recharts';
import moment from 'moment'; // Para manipulação de datas


const data01 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const data02 = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
 
];

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


      // Função para processar as vendas por semana
  const processarDadosPorSemana = (vendas) => {
    const vendasPorSemana = {};
    let maxVenda = 0;

    vendas.forEach((venda) => {
      const semana = moment(venda.Data).week(); // Obtém a semana da data
      if (!vendasPorSemana[semana]) {
        vendasPorSemana[semana] = 0;
      }
      vendasPorSemana[semana] += venda.total;

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
                            <div>
          <input
            type="text"
            placeholder="Pesquisar clientes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="SearchInput"
          />
          </div>

<div className="gráficos-vendas">
<div className="gráfico1-vendas">
      <LineChart
        width={500}
        height={310}
        data={dadosPorSemana} // Utiliza os dados processados por semana
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, maxVendaMes]} /> {/* Eixo Y com limite baseado no valor máximo */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#0a5483" activeDot={{ r: 8 }} />
      </LineChart>
      <h4 className="legenda_vendas1">Total de vendas por semana</h4>
    </div>

       {/* <div className="gráfico02-vendas">
        <ComposedChart
          width={600}
          height={330}
          data={data02}
          margin={{
            top: 20,
            right: 80,
            bottom: 20,
            left: 20,
          }}
          className="grafico02-item"
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} scale="band" />
          <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="amt" fill="#AEDD2B" stroke="#AEDD2B" />
          <Bar dataKey="pv" barSize={20} fill="#0A5483" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
        <h4 className="legenda_vendas2">Gráfico representativo</h4>
          </div>*/}
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
  );
}

export default Hist_vendas;
