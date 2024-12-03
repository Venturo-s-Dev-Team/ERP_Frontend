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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Customized,
  Rectangle,
  PieChart, Pie, Sector, Cell
} from "recharts";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const RADIAN = Math.PI / 180;
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >Total</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

function Home() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState("");
  const [SelectedTotalEstoque, setSelectedTotalEstoque] = useState(0);
  const [SelectedTotalFuncionario, setSelectedTotalFuncionario] = useState(0);
  const [SelectedTotalVenda, setSelectedTotalVenda] = useState(0);
  const [SelectedTotalLogs, setSelectedTotalLogs] = useState(0);
  const [fluxoCaixa, setFluxoCaixa] = useState([]);
  const [typeUserData, setTypeUserData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [vendasCrescimento, setVendasCrescimento] = useState([]);

  // Array de cores
  const COLORS_GRAFICO = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE", "#FF00FF", "#40E0D0"];

  // Funções para buscar dados de estoque, funcionários, vendas, logs, etc.

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
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const vendas = response.data.InfoTabela || [];

        // Inicializamos um array para armazenar os dados formatados
        const vendasFormatadas = [];

        // Variável para armazenar o total de vendas do mês anterior
        let vendasMesAnterior = 0;

        // Formatar os dados das vendas e calcular o crescimento
        vendas.forEach((venda) => {
          const totalVendas = parseFloat(venda.total) || 0; // Total de vendas em R$
          const nomeMes = venda.Data; // Suponha que "Data" seja no formato 'YYYY-MM'

          // Calcular o crescimento
          const crescimento = vendasMesAnterior ? totalVendas - vendasMesAnterior : 0;

          vendasFormatadas.push({
            name: nomeMes,
            total: totalVendas,
            crescimento: crescimento,
          });

          vendasMesAnterior = totalVendas; // Atualiza o total de vendas do mês atual
        });
        setSelectedTotalVenda(response.data.N_Registros)
        setVendasCrescimento(vendasFormatadas); // Atualiza o estado com os dados formatados
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações de vendas: ", error);
      setVendasCrescimento([]); // Reseta os dados em caso de erro
    }
  };

  const CustomizedRectangle = (props) => {
    const { formattedGraphicalItems } = props;
    const firstSeries = formattedGraphicalItems[0];
    const secondSeries = formattedGraphicalItems[1];

    return firstSeries?.props?.points.map((firstSeriesPoint, index) => {
      const secondSeriesPoint = secondSeries?.props?.points[index];
      const yDifference = firstSeriesPoint.y - secondSeriesPoint.y;

      return (
        <Rectangle
          key={firstSeriesPoint.payload.name}
          width={10}
          height={yDifference}
          x={secondSeriesPoint.x - 5}
          y={secondSeriesPoint.y}
          fill={yDifference > 0 ? 'red' : yDifference < 0 ? 'green' : 'none'}
        />
      );
    });
  };

  const fetchDadosHistoricLogs = async () => {
    try {
      const response = await axios.get(
        `/api/ServerTwo/EmpresaHistoricLogs`,
        { withCredentials: true }
      );
      setSelectedTotalLogs(response.data.N_Registros);
    } catch (err) {
      console.log(err);
      setSelectedTotalLogs(0);
    }
  };

  const fetchDadosFuncionariosPorTipoUser = async (id) => {
    try {
      const response = await axios.get(
        `/api/ServerOne/tableFuncionario/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const funcionarioInfo = response.data.InfoTabela;

        // Contar funcionários por tipo de usuário
        const tipoUsuarioCount = funcionarioInfo.reduce((acc, funcionario) => {
          const tipo = funcionario.TypeUser;
          if (acc[tipo]) {
            acc[tipo] += 1;
          } else {
            acc[tipo] = 1;
          }
          return acc;
        }, {});

        // Preparar os dados para o gráfico de pizza
        const tipoUsuarioData = Object.keys(tipoUsuarioCount).map((tipo) => ({
          name: tipo,
          value: tipoUsuarioCount[tipo],
        }));

        setTypeUserData(tipoUsuarioData); // Atualiza o estado com os dados formatados
      }
    } catch (error) {
      console.error("Erro ao buscar dados de tipos de usuários:", error);
      setTypeUserData([]); // Garante que o estado seja atualizado, mesmo com erro
    }
  };

  const fetchDadosFinanceiros = async (id) => {
    try {
      const [receitasResponse, despesasResponse] = await Promise.all([
        axios.get(`/api/ServerOne/tablereceitas/${id}`, {
          withCredentials: true,
        }),
        axios.get(`/api/ServerOne/tabledespesas/${id}`, {
          withCredentials: true,
        }),
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
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    // Agregando valores por mês
    const receitasPorMes = receitas.reduce((acc, item) => {
      if (item.DataExpiracao) {
        const mes = new Date(item.DataExpiracao).getMonth();
        const valor = parseFloat(item.Valor) || 0;
        acc[mes] = (acc[mes] || 0) + valor;
      }
      return acc;
    }, {});

    const despesasPorMes = despesas.reduce((acc, item) => {
      if (item.DataExpiracao) {
        const mes = new Date(item.DataExpiracao).getMonth();
        const valor = parseFloat(item.Valor) || 0;
        acc[mes] = (acc[mes] || 0) + valor;
      }
      return acc;
    }, {});

    // Identificar meses relevantes
    const mesesRelevantes = Object.keys({
      ...receitasPorMes,
      ...despesasPorMes,
    }).map(Number); // Converte as chaves para números

    // Construir os dados do fluxo de caixa para os meses relevantes
    return mesesRelevantes.map((mes) => ({
      name: meses[mes], // Nome do mês
      receitas: receitasPorMes[mes] || 0,
      despesas: despesasPorMes[mes] || 0,
      fluxoCaixa: (receitasPorMes[mes] || 0) - (despesasPorMes[mes] || 0),
    }));
  };

  // Verificação do token de autenticação
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
    if (userInfo.TypeUser === "Gestor" && userInfo.Status === "NO") {
      return;
    } else if (userInfo.id_EmpresaDb) {
      fetchDadosFinanceiros(userInfo.id_EmpresaDb);
      fetchDadosEstoque(userInfo.id_EmpresaDb);
      fetchDadosFuncionarios(userInfo.id_EmpresaDb);
      fetchDadosVendas(userInfo.id_EmpresaDb);
      fetchDadosHistoricLogs();
      fetchDadosFuncionariosPorTipoUser(userInfo.id_EmpresaDb);
    }
  }, [userInfo.TypeUser, userInfo.id_EmpresaDb]);

  // Verificar se a empresa está ativa
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

          <div className="scroll-despesas">
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
                  <h3>VENDAS</h3>
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

            <div className="graficosDashboard">
              <div className="charts">
                {/* Gráfico de Fluxo de Caixa */}
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
              <div className="charts">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={typeUserData} // Passa os dados formatados para o gráfico
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)} // Atualiza o estado ao passar o mouse
                    >
                      {typeUserData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_GRAFICO[index % COLORS_GRAFICO.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="charts">
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart
                    data={vendasCrescimento} // Dados formatados das vendas
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* Linha de Vendas Totais */}
                    <Line type="monotone" dataKey="total" stroke="#8884d8" name="Vendas Totais (R$)" />

                    {/* Linha de Crescimento das Vendas */}
                    <Line type="monotone" dataKey="crescimento" stroke="#82ca9d" name="Crescimento de Vendas (R$)" />

                    <Customized component={CustomizedRectangle} />
                  </LineChart>
                </ResponsiveContainer>

              </div>
            </div>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Home;