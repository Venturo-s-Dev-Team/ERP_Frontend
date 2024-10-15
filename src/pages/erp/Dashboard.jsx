import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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
import "./Dashboard.css";

// Componentes XAxis e YAxis modificados para usar parâmetros padrão em vez de defaultProps
const XAxisWithDefault = (props) => <XAxis {...props} />;
const YAxisWithDefault = (props) => <YAxis {...props} />;

function Home() {

  const navigate = useNavigate();

  const InfoData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  // Token e Logout
  const [userInfo, setUserInfo] = useState('');
  //Informações das tabelas
  const [SelectedTotalEstoque, setSelectedTotalEstoque] = useState(0) 
  const [SelectedTotalFuncionario, setSelectedTotalFuncionario] = useState(0)
  const [SelectedTotalVenda, setSelectedTotalVenda] = useState(0)
  const [SelectedTotalLogs, setSelectedTotalLogs] = useState(0)

  const fetchDadosEstoque = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableEstoque/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setSelectedTotalEstoque(response.data.N_Registros);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
      setSelectedTotalEstoque(0)
    }
  };

  const fetchDadosFuncionarios = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableFuncionario/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setSelectedTotalFuncionario(response.data.N_Registros);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
      setSelectedTotalFuncionario(0)
    }
  };

  const fetchDadosVendas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/VendasConcluidas/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setSelectedTotalVenda(response.data.N_Registros);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
      setSelectedTotalVenda(0)
    }
  };

  const fetchDadosHistoricLogs = async (id) => {
    try {
      const response = await axios.get(`/api/ServerTwo/EmpresaHistoricLogs/${id}`, {
        withCredentials: true
      });
      setSelectedTotalLogs(response.data.N_Registros)
    } catch (err) {
      console.log(err);
      setSelectedTotalLogs(0)
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);
  
  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchDadosEstoque(userInfo.id_EmpresaDb);
      fetchDadosFuncionarios(userInfo.id_EmpresaDb)
      fetchDadosVendas(userInfo.id_EmpresaDb)
      fetchDadosHistoricLogs(userInfo.id_EmpresaDb)
    }
  }, [userInfo.id_EmpresaDb]);
  


  if (userInfo.ValoresNull === true) {
    navigate('/CadastroEmpresa')
  } else if (userInfo.Status === 'NO') {
    return <div>{userInfo.Nome_user}, sua empresa não esta autorizada, entre em contato conosco via e-mail do sistema ou no nosso número de WhatsApp: (19)98171-2080 </div>
  }

  return (
    <div >
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
            <h3>VENDAS TOTAIS</h3>
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={InfoData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxisWithDefault dataKey="name" />
            <YAxisWithDefault />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={InfoData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxisWithDefault dataKey="name" />
            <YAxisWithDefault />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default Home;
