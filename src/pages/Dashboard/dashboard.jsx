import React, { useEffect, useState } from "react";
import "./dashboard.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  BsFillArchiveFill,
  BsPeopleFill,
  BsFillBellFill,
  BsListCheck,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Home() {
  const navigate = useNavigate();

  // Dados do token e estados de usuário
  const [userInfo, setUserInfo] = useState("");
  const [SelectedTotalEstoque, setSelectedTotalEstoque] = useState(0);
  const [SelectedTotalFuncionario, setSelectedTotalFuncionario] = useState(0);
  const [SelectedTotalVenda, setSelectedTotalVenda] = useState(0);
  const [SelectedTotalLogs, setSelectedTotalLogs] = useState(0);

  // Estado para o fluxo de caixa
  const [fluxoCaixa, setFluxoCaixa] = useState([]);

  // Funções de Fetch para Estoque, Funcionários, Vendas, Logs
  const fetchDadosEstoque = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableEstoque/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSelectedTotalEstoque(response.data.N_Registros);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
      setSelectedTotalEstoque(0);
    }
  };

  const fetchDadosFuncionarios = async (id) => {
    try {
      const response = await axios.get(
        `/api/ServerOne/tableFuncionario/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSelectedTotalFuncionario(response.data.N_Registros);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
      setSelectedTotalFuncionario(0);
    }
  };

  const fetchDadosVendas = async (id) => {
    try {
      const response = await axios.get(
        `/api/ServerOne/VendasConcluidas/${id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSelectedTotalVenda(response.data.N_Registros);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
      setSelectedTotalVenda(0);
    }
  };

  const fetchDadosHistoricLogs = async (id) => {
    try {
      const response = await axios.get(
        `/api/ServerTwo/EmpresaHistoricLogs/${id}`,
        { withCredentials: true }
      );
      setSelectedTotalLogs(response.data.N_Registros);
    } catch (err) {
      console.log(err);
      setSelectedTotalLogs(0);
    }
  };

  // Função para buscar receitas, despesas e calcular fluxo de caixa
  const fetchDadosFinanceiros = async (id) => {
    try {
      const [receitasResponse, despesasResponse] = await Promise.all([
        axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true }),
        axios.get(`/api/ServerOne/tabledespesas/${id}`, { withCredentials: true }),
      ]);

      const receitas = receitasResponse.data.InfoTabela || [];
      const despesas = despesasResponse.data.InfoTabela || [];

      const fluxo = calcularFluxoCaixa(receitas, despesas);
      setFluxoCaixa(fluxo);
    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
      setFluxoCaixa([]);
    }
  };

  const calcularFluxoCaixa = (receitas, despesas) => {
    console.log("Receitas", receitas, "Despesas", despesas);
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril",
      "Maio", "Junho", "Julho", "Agosto",
      "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
    // Processa as receitas por mês
    const receitasPorMes = receitas.reduce((acc, item) => {
      if (item.DataExpiracao) {
        const mes = new Date(item.DataExpiracao).getMonth();
        const valor = parseFloat(item.Valor) || 0;
        acc[mes] = (acc[mes] || 0) + valor;
      }
      return acc;
    }, {});
  
    // Processa as despesas por mês
    const despesasPorMes = despesas.reduce((acc, item) => {
      if (item.DataExpiracao) {
        const mes = new Date(item.DataExpiracao).getMonth();
        const valor = parseFloat(item.Valor) || 0;
        acc[mes] = (acc[mes] || 0) + valor;
      }
      return acc;
    }, {});
  
    // Monta o array de fluxo de caixa por mês
    return meses.map((mes, index) => ({
      name: mes,
      receitas: receitasPorMes[index] || 0,
      despesas: despesasPorMes[index] || 0,
      fluxoCaixa: (receitasPorMes[index] || 0) - (despesasPorMes[index] || 0),
    }));
  };
  
  // Verificação de token
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

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchDadosFinanceiros(userInfo.id_EmpresaDb);
      fetchDadosEstoque(userInfo.id_EmpresaDb);
      fetchDadosFuncionarios(userInfo.id_EmpresaDb);
      fetchDadosVendas(userInfo.id_EmpresaDb);
      fetchDadosHistoricLogs(userInfo.id_EmpresaDb);
    }
  }, [userInfo.id_EmpresaDb]);

  if (userInfo.ValoresNull === true) {
    navigate("/Cad_empresa");
  } else if (userInfo.Status === "NO") {
    return (
      <SideBarPage>
        <main>
          <div className="BoxMensagem-DB">
            <h1 className="BoasVindasMensagem-DB">Seja Bem Vindo(a)!</h1>
            <p className="PMensagem-DB">
              {userInfo.Nome_user}, sua empresa não está autorizada. Entre em
              contato conosco via e-mail do sistema ou no nosso número de
              WhatsApp: (19)98171-2080.
            </p>
          </div>
        </main>
      </SideBarPage>
    );
  }

  return (
    <SideBarPage>
      <main>
        <div>
          <div className="main-title">
            <h3>DASHBOARD - BEM VINDO {userInfo.Nome_user}</h3>
          </div>

          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>ITENS DE ESTOQUE</h3>
                <BsFillArchiveFill className="card_icon" />
              </div>
              <h1>{SelectedTotalEstoque}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>PEDIDOS</h3>
                <BsListCheck className="card_icon" />
              </div>
              <h1>{SelectedTotalVenda}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>FUNCIONÁRIOS</h3>
                <BsPeopleFill className="card_icon" />
              </div>
              <h1>{SelectedTotalFuncionario}</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>ALTERAÇÕES</h3>
                <BsFillBellFill className="card_icon" />
              </div>
              <h1>{SelectedTotalLogs}</h1>
            </div>
          </div>

          <div className="charts">

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fluxoCaixa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="fluxoCaixa"
                  stroke="#8884d8"
                  name="Fluxo de Caixa"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="receitas"
                  stroke="#82ca9d"
                  name="Receitas"
                />
                <Line
                  type="monotone"
                  dataKey="despesas"
                  stroke="#FF0000"
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Home;
