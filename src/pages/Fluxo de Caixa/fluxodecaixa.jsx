import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import "./fluxodecaixa.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function FluxoCaixa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  const [fluxos, setFluxos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState(0); // Estado para o saldo inicial
  const [saldoDisponivel, setSaldoDisponivel] = useState(0); // Estado para o saldo disponível para o dia seguinte
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa


  // Função para abrir modal
  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  // Função para verificar o token
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

  // Função para calcular o saldo inicial do dia anterior
  const calcularSaldoInicial = () => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    const receitasDiaAnterior = fluxos
      .filter(fluxo => new Date(fluxo.DataExpiracao).toDateString() === ontem.toDateString() && fluxo.entrada > 0)
      .reduce((acc, fluxo) => acc + fluxo.entrada, 0);

    const despesasDiaAnterior = fluxos
      .filter(fluxo => new Date(fluxo.DataExpiracao).toDateString() === ontem.toDateString() && fluxo.saida > 0)
      .reduce((acc, fluxo) => acc + fluxo.saida, 0);

    const saldo = receitasDiaAnterior - despesasDiaAnterior;
    setSaldoInicial(saldo);
  };
  // Função para calcular o saldo disponível para o dia seguinte
  const calcularSaldoDisponivel = () => {
    const hoje = new Date();

    // Certifique-se de que os valores são números antes de realizar a soma
    const receitasHoje = fluxos
      .filter(fluxo => new Date(fluxo.DataExpiracao).toDateString() === hoje.toDateString() && fluxo.entrada > 0)
      .reduce((acc, fluxo) => acc + (Number(fluxo.entrada) || 0), 0);

    const despesasHoje = fluxos
      .filter(fluxo => new Date(fluxo.DataExpiracao).toDateString() === hoje.toDateString() && fluxo.saida > 0)
      .reduce((acc, fluxo) => acc + (Number(fluxo.saida) || 0), 0);

    // Evite NaN, garantindo que saldoInicial seja numérico
    const saldoHoje = receitasHoje - despesasHoje;
    const saldoTotal = (Number(saldoInicial) || 0) + saldoHoje;

    setSaldoDisponivel(saldoTotal);
  };

  // Função para carregar dados do banco de dados
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const receitasResponse = await axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true });
        const despesasResponse = await axios.get(`/api/ServerOne/tabledespesas/${id}`, { withCredentials: true });

        // Transforme os dados recebidos em um formato adequado para a tabela
        const receitas = receitasResponse.data.InfoTabela.map((receita) => ({
          id: receita.id,
          descricao: receita.Nome,
          entrada: receita.Valor,
          saida: 0,
          DataExpiracao: receita.DataExpiracao,
        }));

        const despesas = despesasResponse.data.InfoTabela.map((despesa) => ({
          id: despesa.id,
          descricao: despesa.Nome,
          entrada: 0,
          saida: despesa.Valor,
          DataExpiracao: despesa.DataExpiracao,
        }));

        // Combine receitas e despesas
        const fluxoCaixa = [...receitas, ...despesas];

        setFluxos(fluxoCaixa);
        calcularSaldoInicial(); // Recalcular saldo inicial após atualizar fluxos
      } catch (error) {
        console.error("Erro ao carregar dados do fluxo de caixa", error);
      }
    };

    if (userInfo && userInfo.id_EmpresaDb) {
      fetchData(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  useEffect(() => {
    calcularSaldoDisponivel(); // Recalcular saldo disponível após atualizar fluxos e saldo inicial
  }, [fluxos, saldoInicial]);

  // Função para filtrar os fluxos do dia atual
  const filtrarFluxosDoDia = () => {
    const hoje = new Date();
    return fluxos.filter(fluxo => new Date(fluxo.DataExpiracao).toDateString() === hoje.toDateString());
  };

  const fluxosDoDia = filtrarFluxosDoDia();

  // Filtro das receitas
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredFluxo = fluxosDoDia.filter(
    (fluxo) =>
      fluxo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Fluxo de Caixa</h3>
        </div>
        <div className="scroll-despesas">
          <div className="box_fluxo">
            <div className="saldo1-box">
              <h3>Saldo inicial do dia anterior</h3>
              <h1>R$ {saldoInicial.toFixed(2)}</h1>{" "}
              {/* Exibir o saldo calculado */}
            </div>
            <div className="saldo2-box">
              <h3>Saldo disponível para o dia seguinte</h3>
              <h1>R$ {saldoDisponivel.toFixed(2)}</h1>
              {/* Exibir o saldo calculado */}
            </div>
          </div>

          {/* Input de pesquisa */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "350px",
            }}
          >
            <BsSearch
              style={{ marginLeft: "10px", color: "#888", fontSize: "18px" }}
            />
            <input
              type="text"
              placeholder="Pesquisar produtos"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #fff",
                padding: "12px",
                fontSize: "16px",
                width: "300px",
                outline: "none",
                transition: "border-color 0.3s",
                paddingLeft: "10px",
              }}
            />
          </div>

          <div className="Fluxos_List">
            <table>
              <caption>Fluxo de Caixa - Diário</caption>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                </tr>
              </thead>
              <tbody>
                {filteredFluxo.map((fluxo) => (
                  <tr key={fluxo.id}>
                    <td>{fluxo.descricao}</td>
                    <td>R$ {fluxo.entrada}</td>
                    <td>R$ {fluxo.saida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default FluxoCaixa;