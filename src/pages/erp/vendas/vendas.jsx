import React from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,  ComposedChart,
  Area,
  Bar,
 } from 'recharts';

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

const vendas = [
  { id: 1, name: "Venda 1", valor: 2143, data: "09/10/23", },
  { id: 2, name: "Venda 2", valor: 1311, data: "20/04/20", },
  { id: 3, name: "Venda 3", valor: 1232, data: "30/04/23", },
];

function Hist_vendas() {
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Histórico de Vendas</h3>
      </div>
       {/* Botões para cadastrar despesas, excluir ou editar */}
       <div className="Button_Cad">
          <button className="Button-Menu">
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

<div className="gráficos-vendas">
  <div className="gráfico1-vendas">
        <LineChart
          width={500}
          height={310}
          data={data01}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          className="grafico01-item"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#AEDD2B" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#0a5483" />
        </LineChart>
        <h4 className="legenda_vendas1">Gráfico representativo</h4>
        </div>

        <div className="gráfico02-vendas">
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
          </div>
        </div>
        <div className="tabela-vendas">
        <table>
            <caption>Histórico de Vendas</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.name}</td>
                  <td>R$ {venda.valor.toFixed(2)}</td>
                  <td>{venda.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
    </main>
  );
}

export default Hist_vendas;
