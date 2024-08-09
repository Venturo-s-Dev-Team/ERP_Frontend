import React from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];
function Despesas() {
  return (
    <main className="main-container">
      {/* Título principal */}
      <div className="main-title">
        <h3>Despesas</h3>
      </div>

      {/* Botões para cadastrar despesas, excluir ou editar */}
      <div className="Button_Despesas">
        <button className="Button-Despesas_letras">
          Adicionar
          <FaPlus />
        </button>
        <button className="Button-Despesas_letras">
          Editar
          <FaPenToSquare />
        </button>
        <button className="Button-Despesas_letras">
          Excluir
          <FaTrashCan />
        </button>
      </div>

      {/* Div com as despesas mais gerais */}

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

      {/* Um gráfico representativo */}
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
        <h4 className="legenda_despesas">Gráfico representativo</h4>
      </div>
      {/* Div para tabela com as despesas detalhadas */}
    </main>
  );
}

export default Despesas;
