import React, { useState } from "react";
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
import {Modal} from "react-bootstrap";

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

const despesas = [
  {
    id: 1,
    name: "Despesa 1",
    descricao: "A despesa número 1",
    valor: 244,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 2,
    name: "Despesa 2",
    descricao: "A despesa número 2",
    valor: 435,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 3,
    name: "Despesa 3",
    descricao: "A despesa número 3",
    valor: 345,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 4,
    name: "Despesa 4",
    descricao: "A despesa número 4",
    valor: 5777,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 5,
    name: "Despesa 5",
    descricao: "A despesa número 5",
    valor: 102,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 6,
    name: "Despesa 6",
    descricao: "A despesa número 6",
    valor: 345,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 7,
    name: "Despesa 7",
    descricao: "A despesa número 7",
    valor: 243,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 8,
    name: "Despesa 8",
    descricao: "A despesa número 8",
    valor: 121,
    data: "09/03/25",
    finalizado: "Sim",
  },
  {
    id: 9,
    name: "Despesa 9",
    descricao: "A despesa número 9",
    valor: 888,
    data: "09/03/25",
    finalizado: "Sim",
  },
];



// Função para alterar o botão de finalização da tabela
function Despesas() {
  const [finalizar, setFinalizar] = useState(despesas);

  const Finalizado = (id) => {
    setFinalizar((prevDespesas) =>
      prevDespesas.map((despesa) =>
        despesa.id === id
          ? {
              ...despesa,
              finalizado: despesa.finalizado === "Não" ? "Sim" : "Não",
            }
          : despesa
      )
    );
  };

  // Função para abrir modal - add
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
          <h1>R$ 14.987,93</h1>
        </div>
        <div className="despesa2-box">
          <h3>Contas a pagar em atraso</h3>
          <h1>R$ 1.298,24</h1>
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
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data de Expiração</th>
              <th>Finalizado</th>
            </tr>
          </thead>
          <tbody>
            {finalizar.map((despesa) => (
              <tr key={despesa.id}>
                <td>{despesa.name}</td>
                <td>{despesa.descricao}</td>
                <td>R$ {despesa.valor.toFixed(2)}</td>
                <td>{despesa.data}</td>
                <td>
                  {despesa.finalizado}
                  <button className={`despesas_opc_btn ${
                      despesa.finalizado === "Sim" ? "sim" : "nao"
                    }`} onClick={() => Finalizado(despesa.id)}>
                    {despesa.finalizado === "Não" ? "Marcar como Sim" : "Marcar como Não"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<div>
  <Modal   style={{
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
          background: "linear-gradient(135deg, #ddd, silver)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={fecharModal}>
          <div>
          <div className="DivModalDesp">
          <div className="HeaderModal">
            <h1>Registrar Venda</h1>
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
        
            </div>

    </Modal>
    </div>
    </main>
  );
}

export default Despesas;
