import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./dre.css";

const data = [
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

const tabelas = [
  { id: 1, descricao: "Venda", entrada: 111, saida: 111 },
  { id: 2, descricao: "Venda", entrada: 111, saida: 111 },
  { id: 3, descricao: "Venda", entrada: 111, saida: 111 },
  { id: 4, descricao: "Venda", entrada: 111, saida: 111 },
  { id: 5, descricao: "Venda", entrada: 111, saida: 111 },
];

function Dre() {
  return (
    <main>
      <div className="main-titleDRE">
        <h3>Demonstrativo de resultado</h3>
      </div>
      <div className="Dre_List">
        <table>
          <caption>Relatório Demonstrativo de Resultado</caption>
          <thead>
            <tr>
              {" "}
              <th>Descrição</th>
              <th>Saída</th>
              <th>Entrada</th>
            </tr>
          </thead>
          <tbody>
            {tabelas.map((tabela) => (
              <tr key={tabela.id}>
                <td>{tabela.descricao}</td>
                <td> {tabela.saida}</td>
                <td>{tabela.entrada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Dre-Grafico">
        <LineChart
          width={500}
          height={300}
          data={data}
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
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    </main>
  );
}

export default Dre;
