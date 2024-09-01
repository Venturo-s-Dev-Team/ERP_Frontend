import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const data02 = [
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

function Despesas() {
  const navigate = useNavigate();
  const [Despesas, setDespesas] = useState([]);
  
  // Função para alternar o valor da coluna "Finalizado"
  const Finalizado = (id) => {
    setDespesas((prevDespesas) =>
      prevDespesas.map((despesa) =>
        despesa.id === id
          ? {
              ...despesa,
              Finalizado: despesa.Finalizado === 0 ? 1 : 0,
            }
          : despesa
      )
    );
  };

  const [userInfo, setUserInfo] = useState(null);

  // Verificação do token e obtenção das informações do usuário
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/login');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);

  // Função para carregar dados do banco de dados
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const despesasResponse = await axios.get(`/api/ServerOne/tabledespesas/${id}`, { withCredentials: true });
        setDespesas(despesasResponse.data.InfoTabela);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };

    if (userInfo && userInfo.id_user) {
      fetchData(userInfo.id_user);
    }
  }, [userInfo]);

  // Calcular total das despesas não finalizadas
  const calcularTotalDespesasNaoFinalizadas = () => {
    const total = Despesas
        .filter(despesa => despesa.Finalizado === 0)
        .reduce((acc, despesa) => acc + (parseFloat(despesa.Valor) || 0), 0);

    return total.toFixed(2);
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Mês em JavaScript é 0-indexado
};

const calcularTotalDespesasAtrasadas = () => {
  if (!Array.isArray(Despesas)) {
    console.error('Despesas não é um array:', Despesas);
    return 0;
  }
  
  const hoje = new Date();
  console.log('Despesas:', Despesas);
  console.log('Data atual:', hoje);

  const total = Despesas
    .filter(despesa => {
      const vencimento = parseDate(despesa.DataExpiracao);
      console.log('Despesa:', despesa);
      console.log('Vencimento:', vencimento);
      return vencimento && despesa.Finalizado === 0 && vencimento < hoje;
    })
    .reduce((total, despesa) => total + (parseFloat(despesa.Valor) || 0), 0);

  console.log('Total atrasadas:', total);
  return total;
};

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  return (
    <main className="main-container">
      {/* Título principal */}
      <div className="main-title">
        <h3>Despesas</h3>
      </div>

      {/* Botões para cadastrar despesas, excluir ou editar */}
      <div className="Button_Cad">
        <button className="Button-Menu" onClick={abrirModal}>
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
      </div>

      {/* Box sobre contas */}
      <div className="box_desp">
        <div className="despesa1-box">
          <h3>Contas a pagar em aberto</h3>
          <h1>R$ {calcularTotalDespesasNaoFinalizadas()}</h1>
        </div>
        <div className="despesa2-box">
          <h3>Contas a pagar em atraso</h3>
          <h1>R$ {calcularTotalDespesasAtrasadas()}</h1>
        </div>
      </div>

      {/* Gráficos representativos */}
      <div className="gráficos">
        <div className="gráfico1">
          <PieChart width={700} height={300}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data01}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#02416D"
              label
              className="pie1"
            />
            <Tooltip />
          </PieChart>
          <h4 className="legenda_despesas1">Gráfico representativo</h4>
        </div>
        <div className="gráfico02">
          <BarChart
            width={500}
            height={300}
            data={data02}
            margin={{
              top: 20,
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
            <Bar dataKey="pv" stackId="a" fill="#02416D" />
            <Bar dataKey="amt" stackId="a" fill="#AEDD2B" />
            <Bar dataKey="uv" fill="#066699" />
          </BarChart>
          <h4 className="legenda_despesas2">Gráfico representativo</h4>
        </div>
      </div>

      {/* Div para tabela com as despesas detalhadas */}
      <div className="Despesas_List">
        <table>
          <caption>Registro de Despesas</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Data de Expiração</th>
              <th>Finalizado</th>
            </tr>
          </thead>
          <tbody>
            {Despesas.map((despesa) => (
              <tr key={despesa.id}>
                <td>{despesa.Nome}</td>
                <td>R$ {Number(despesa.Valor || 0).toFixed(2)}</td>
                <td>{despesa.DataExpiracao}</td>
                <td>
                  <button className={`despesas_opc_btn ${
                      despesa.Finalizado === 1 ? "sim" : "nao"
                    }`} onClick={() => Finalizado(despesa.id)}>
                    {despesa.Finalizado === 0 ? "Marcar como Sim" : "Marcar como Não"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para adicionar despesas */}
      <div>
        <Modal   
          style={{
            position: "fixed",
            top: "50%",
            bottom: 0,
            left: "50%",
            right: 0,
            zIndex: 1000,
            width: "70%",
            height: "73%",
            borderRadius: 20,
            transform: "translate(-50%, -50%)",
            background: "white",
            boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
          }}
          show={showModal}
          onHide={fecharModal}
        >
          <div className="DivModalDesp">
            <div className="HeaderModal">
              <h1>Registrar Despesas</h1>
            </div>
            <form>
              <input type="number" placeholder="Valor" />
              <input type="text" placeholder="Nome" />
              <input type="date" placeholder="Data de Expiração" />
              <input type="text" placeholder="Descrição" />
              <div className="FooterButton">
                <button className="RegisterPr">Registrar</button>
                <button className="FecharPr" onClick={fecharModal}>
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </main>
  );
}

export default Despesas;