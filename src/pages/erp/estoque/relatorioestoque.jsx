import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
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
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

// Função para exibir porcentagem no gráfico de pizza
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Relatorioestoque() {
  const navigate = useNavigate();

  const InfoData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: -3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: -2000, pv: -9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: -1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: -3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  const receitasData = [
    { name: 'Produto A', value: 400 },
    { name: 'Produto B', value: 300 },
    { name: 'Produto C', value: 300 },
    { name: 'Produto D', value: 200 },
  ];

  const despesasData = [
    { name: 'Custo A', value: 100 },
    { name: 'Custo B', value: 200 },
    { name: 'Custo C', value: 300 },
    { name: 'Custo D', value: 400 },
  ];

  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          navigate('/');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    verifyToken();
  }, [navigate]);

  if (userInfo.ValoresNull === true) {
    navigate('/CadastroEmpresa');
  } else if (userInfo.Status === 'NO') {
    return <div>{userInfo.Nome_user}, sua empresa não está autorizada. Contate-nos via e-mail ou WhatsApp: (19) 98171-2080.</div>;
  }

  return (
    <div>
      <div className="main-title">
        <h2>RELATÓRIO ESTOQUE</h2>
      </div>

      <div className="charts">
        {/* Gráfico de Barra */}
        <ResponsiveContainer width="100%" height={300}>
        <h3>Saldo do Fluxo de Caixa</h3>
          <BarChart
            data={InfoData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* Gráfico de Linha */}
        <ResponsiveContainer width="100%" height={300}>
        <h3>Fluxo de Caixa</h3>
          <LineChart
            data={InfoData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        {/* Gráfico de Pizza para Receitas */}
        <ResponsiveContainer width="50%" height={300}>
        <h3>Receitas</h3>
          <PieChart>
            <Pie
              data={receitasData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {receitasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Gráfico de Pizza para Despesas */}
        <ResponsiveContainer width="50%" height={300}>
        <h3>Despesas</h3>
          <PieChart>
            <Pie
              data={despesasData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {despesasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Relatorioestoque;
