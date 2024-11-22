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
  Cell, // Importa o Cell
} from "recharts";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Corrigido para importar corretamente
import SideBarPage from "../../components/Sidebar/SideBarPage";

// Define as cores para cada categoria
const COLORS = {
  "Contas em Aberto": "#103b74", // Azul
  "Contas Atrasadas": "#8f1515", // Vermelho
};

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
  const [SelectedDespesa, setSelectedDespesa] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Determina se está no modo de edição
  const [dataGrafico, setDataGrafico] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

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

  // Verificação do token e obtenção das informações do usuário
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
          navigate("/login");
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  // Carregar dados inicialmente
  useEffect(() => {
    if (userInfo && userInfo.id_EmpresaDb) {
      fetchData(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

// Função para carregar dados do banco de dados
const fetchData = async (userId) => {
  try {
    const despesasResponse = await axios.get(
      `/api/ServerOne/tabledespesas/${userId}`,
      { withCredentials: true }
    );

    const despesas = despesasResponse.data.InfoTabela;
    setDespesas(despesas);

    // Inicializar os totais
    let totalAbertas = 0;
    let totalAtrasadas = 0;

    // Classificar despesas
    despesas.forEach((despesa) => {
      const dataExpiracao = new Date(despesa.DataExpiracao).getTime();
      const isAtrasada = despesa.Finalizado === 0 && dataExpiracao < new Date().getTime();

      if (isAtrasada) {
        totalAtrasadas += parseFloat(despesa.Valor || 0);
      } else if (despesa.Finalizado === 0) {
        totalAbertas += parseFloat(despesa.Valor || 0);
      }
    });

    // Atualize o estado do gráfico com valores formatados
    setDataGrafico([
      { name: "Contas em Aberto", value: totalAbertas },
      { name: "Contas Atrasadas", value: totalAtrasadas },
    ]);
  } catch (error) {
    console.error("Erro ao carregar dados", error);
  }
};

  // Função para formatar valores em reais
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular total das despesas não finalizadas
  const calcularTotalDespesasNaoFinalizadas = () => {
    const total = Despesas.filter((despesa) => despesa.Finalizado === 0).reduce(
      (acc, despesa) => acc + (parseFloat(despesa.Valor) || 0),
      0
    );

    return total.toFixed(2);
  };

  // Função para calcular o total das despesas não finalizadas e que estão atrasadas
  const calcularTotalDespesasAtrasadas = () => {
    const dateAtual = new Date().getTime(); // Timestamp da data atual

    const total = Despesas.filter((despesa) => {
      const dataExpiracao = new Date(despesa.DataExpiracao).getTime(); // Timestamp da data de expiração

      // Verifica se a despesa não está finalizada e se está atrasada
      return despesa.Finalizado === 0 && dataExpiracao < dateAtual;
    }).reduce((acc, despesa) => acc + (parseFloat(despesa.Valor) || 0), 0);

    return total.toFixed(2);
  };

  const handleSubmitDespesa = async (event) => {
    event.preventDefault();

    const id_EmpresaDb = parseInt(userInfo.id_EmpresaDb); // Alterado para userInfo.id_user

    const despesaData = {
      Valor: valor,
      Nome: nome,
      DataExpiracao: dataExpiracao,
      id_EmpresaDb,
      userId: userInfo.id_user,
      userName: userInfo.Nome_user,
    };

    if (isEditMode === true) {
      try {
        const response = await axios.put(
          `api/ServerTwo/AtualizandoInfoDespesa/${SelectedDespesa.id}`,
          despesaData,
          { withCredentials: true }
        );
        console.log("Atualizado: ", response);
        await fetchData(id_EmpresaDb);
        fecharModal();
      } catch (error) {
        console.error("Erro ao atualizar despesa", error);
      }
    } else {
      // Registro da despesa
      try {
        const response = await axios.post(
          `/api/ServerTwo/registrarDespesas`,
          despesaData,
          { withCredentials: true }
        );
        console.log("Dados da despesa:", response);
        await fetchData(id_EmpresaDb);
        fecharModal();
      } catch (error) {
        console.error("Erro ao registrar despesa", error);
      }
    }
  };

  // Modal control
  const abrirModal = () => {
    setShowModal(true);
    if (isEditMode && SelectedDespesa) {
      setValor(SelectedDespesa.Valor || "");
      setNome(SelectedDespesa.Nome || "");
      setDataExpiracao(SelectedDespesa.DataExpiracao || "");
    } else {
      // Reset fields when adding a new despesa or if no despesa is selected
      setValor("");
      setNome("");
      setDataExpiracao("");
    }
  };

  const fecharModal = () => setShowModal(false);

  // Função para atualizar o estado finalizado para 1
  const UpdateFinalizado1 = async (id) => {
    const id_EmpresaDb = parseInt(userInfo.id_EmpresaDb); // Alterado para userInfo.id_user

    try {
      const response = await axios.put(
        `/api/ServerOne/tableDespesasFinalizado/${id}`,
        { id_EmpresaDb }, // Se não há dados a enviar, mantenha o corpo vazio
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Despesa atualizada com sucesso");
        await fetchData(id_EmpresaDb); // Atualize os dados após a atualização
      } else {
        console.error("Erro ao atualizar a despesa");
      }
    } catch (err) {
      console.error("Erro ao atualizar a despesa", err);
    }
  };

  // Função para atualizar o estado finalizado para 0
  const UpdateFinalizado0 = async (id) => {
    const id_EmpresaDb = parseInt(userInfo.id_EmpresaDb); // Alterado para userInfo.id_user

    try {
      const response = await axios.put(
        `/api/ServerOne/tableDespesasNaoFinalizado/${id}`,
        { id_EmpresaDb }, // Se não há dados a enviar, mantenha o corpo vazio
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Despesa atualizada com sucesso");
        await fetchData(id_EmpresaDb); // Atualize os dados após a atualização
      } else {
        console.error("Erro ao atualizar a despesa");
      }
    } catch (err) {
      console.error("Erro ao atualizar a despesa", err);
    }
  };

  const handleEdit = () => {
    if (!SelectedDespesa) {
      alert("Por favor, selecione uma despesa para editar.");
      return;
    }

    setIsEditMode(true); // Define o modo de edição
    setShowModal(true); // Abre o modal
  };

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
    <SideBarPage>
      <main>
        {/* Título principal */}
        <div>
          <h3>Despesas</h3>
        </div>

        {/* Botões para cadastrar despesas, excluir ou editar */}
        <div className="scroll-despesas">
          <div className="Button_Cad">
            <button onClick={abrirModal}>
              Adicionar <FaPlus />
            </button>
            <button onClick={handleEdit}>
              Editar <FaPenToSquare />
            </button>

            <button onClick={exportToExcel}>
              Exportar <FaFileExport />
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
                  data={dataGrafico}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => formatCurrency(value)} // Formata os valores no gráfico
                  className="pie1"
                >
                  {/* Aplicando cores diferentes para cada fatia */}
                  {dataGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
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
                    <td>{new Date(despesa.DataExpiracao).toLocaleDateString()}</td>
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
                  <h1>{isEditMode ? "Editar Despesa" : "Registrar Despesas"}</h1>
                </div>
                <form onSubmit={handleSubmitDespesa}>
                  <input
                    type="number"
                    placeholder="Valor"
                    onChange={(e) => setValor(e.target.value)}
                    value={valor}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Nome"
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                    required
                  />
                  <input
                    type="date"
                    placeholder="Data de Expiração"
                    onChange={(e) => setDataExpiracao(e.target.value)}
                    value={dataExpiracao}
                    required
                  />
                  <div>
                    <button type="submit" className="RegisterPr">
                      {isEditMode ? "Atualizar" : "Registrar"}
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
        </div>
      </main>
    </SideBarPage>
  );
}

export default Despesas;
