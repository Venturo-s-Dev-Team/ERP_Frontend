import React, { useState, useEffect } from "react";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
} from "react-icons/fa6";
import * as XLSX from "xlsx"; // Importa a biblioteca xlsx
import "./despesas.css";

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
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./despesas.css";

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
  const [valor, setValor] = useState("");
  const [nome, setNome] = useState("");
  const [dataExpiracao, setDataExpiracao] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dataGrafico, setDataGrafico] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  // Modal control
  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  // Função para exportar a tabela de despesas para Excel
  const exportToExcel = () => {
    // Cria uma cópia dos dados, modificando a coluna 'Finalizado'
    const modifiedDespesas = Despesas.map((despesa) => ({
      ...despesa,
      Finalizado: despesa.Finalizado === 1 ? "Sim" : "Não", // Substitui 1 por 'Sim' e 0 por 'Não'
    }));

    // Cria um novo workbook e uma nova worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(modifiedDespesas, {
      header: ["Nome", "Valor", "DataExpiracao", "Finalizado"],
      // Define o formato das células para valores monetários
      cellStyles: {
        Valor: { numFmt: "R$ #,##0.00" },
      },
    });

    // Adiciona a worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Despesas");

    // Exporta o workbook como um arquivo Excel
    XLSX.writeFile(wb, "despesas.xlsx");
  };

  return (
    <main>
      {/* Título principal */}
      <div>
        <h3>Despesas</h3>
      </div>

      {/* Botões para cadastrar despesas, excluir ou editar */}
      <div className="Button_Cad">
        <button onClick={abrirModal}>
          Adicionar
          <FaPlus />
        </button>
        <button>
          Editar
          <FaPenToSquare />
        </button>

        <button onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>

      {/* Box sobre contas */}
      <div className="box_desp">
        <div className="despesa1-box">
          <h3>Contas a pagar em aberto</h3>
          <h1>R$ </h1>
        </div>
        <div className="despesa2-box">
          <h3>Contas a pagar em atraso</h3>
          <h1>R$</h1>
        </div>
      </div>
      {/* Gráficos representativos */}
      <div className="gráficos">
        <div className="gráfico1">
          <PieChart width={700} height={300}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={dataGrafico}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#02416D"
              label={({ value }) => formatCurrency(value)} // Formata os valores no gráfico
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
        <table id="table-to-export">
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
                  <button
                    className={`despesas_opc_btn ${
                      despesa.Finalizado === 1 ? "sim" : "nao"
                    }`}
                    onClick={() => {
                      if (despesa.Finalizado === 0) {
                        UpdateFinalizado1(despesa.id);
                      } else {
                        UpdateFinalizado0(despesa.id);
                      }
                    }}
                  >
                    {despesa.Finalizado === 0
                      ? "Marcar como Sim"
                      : "Marcar como Não"}
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
          <div className="DivModalDespesas">
            <div>
              <h1>Registrar Despesas</h1>
            </div>
            <form>
              <input
                type="number"
                placeholder="Valor"
                onChange={(e) => setValor(e.target.value)}
                value={valor}
              />
              <input
                type="text"
                placeholder="Nome"
                onChange={(e) => setNome(e.target.value)}
                value={nome}
              />
              <input
                type="date"
                placeholder="Data de Expiração"
                onChange={(e) => setDataExpiracao(e.target.value)}
                value={dataExpiracao}
              />
              <div>
                <button type="submit" className="RegisterPr">
                  Registrar
                </button>
                <button
                  type="button"
                  className="FecharPr"
                  onClick={fecharModal}
                >
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
