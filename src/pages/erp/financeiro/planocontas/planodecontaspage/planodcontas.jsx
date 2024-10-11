import React, { useState, useEffect } from "react";
import "./planodcontas.css";
import PlanosForm from "./planos.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Componente para cada categoria (Receitas ou Despesas)
const Categoria = ({ nome, tipos }) => {
  const [aberto, setAberto] = useState(false);
  const toggleAberto = () => {
    setAberto(!aberto);
  };

  return (
    <div className="categoria">
      <div
        className="categoria-titulo"
        onClick={toggleAberto}
        style={{ cursor: "pointer" }}
      >
        {nome} {aberto ? "▲" : "▼"}
      </div>
      {aberto && (
        <div className="ramificacao">
          <div className="linha-vertical" />
          <ul className="tipos">
            {tipos.map((tipo, index) => (
              <li key={index} className="tipo">
                <div className="linha-horizontal" />
                {tipo.descricao} {/* Mostrar a descrição da conta */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Componente principal que renderiza o plano de contas
const PlanoDeContas = ({ empresaId, selectedPlano }) => {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    fetchContas("Crédito", setReceitas); // Busca as contas de crédito para receitas
    fetchContas("Débito", setDespesas); // Busca as contas de débito para despesas
  }, [empresaId, selectedPlano]); // Adiciona selectedPlano como dependência
  
  const fetchContas = async (tipo, setContas) => { // Adicione setContas aqui
    if (!selectedPlano || !selectedPlano.codigo_plano) {
      console.error("Plano não selecionado");
      return; // Saia da função se o plano não for selecionado
    }
  
    try {
      const response = await axios.get(
        `http://10.144.170.50:5173/api/ServerOne/tableContas/${empresaId}/${selectedPlano.codigo_plano}/${encodeURIComponent(tipo)}`
      );
      setContas(response.data); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error(`Erro ao buscar contas (${tipo}):`, error);
    }
  };
  


  return (
    <div>
      <Categoria nome="Receitas" tipos={receitas} />
      <Categoria nome="Despesas" tipos={despesas} />
    </div>
  );
};

function PlanoDContas() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("Planos de Contas");
  const [userInfo, setUserInfo] = useState({});
  const [contaData, setContaData] = useState({
    codigo_reduzido: "",
    descricao: "",
    mascara: "",
    orientacao: "",
    tipo: "",
    userId: "", // Preencher com o ID do usuário logado
    userName: "", // Preencher com o nome do usuário logado
  });
  const [planos, setPlanos] = useState([]); // Estado para armazenar os planos
  const [selectedPlano, setSelectedPlano] = useState(""); // Estado para o plano selecionado

  // Carrega as informações do token e busca os planos ao carregar o componente
  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchPlanos(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  // Verifica o token do usuário
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
        navigate("/");
      }
    } catch (error) {
      console.error("Token inválido", error);
      navigate("/login");
    }
  };

  // Função para buscar os planos da API
  const fetchPlanos = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tablePlanos/${id}`);
      setPlanos(response.data); // Agora pegamos a resposta completa e colocamos no estado
    } catch (error) {
      console.error("Erro ao buscar os planos:", error);
      alert("Erro ao buscar os planos.");
    }
  };

  // Atualiza os dados da conta conforme o formulário é preenchido
  const handleContaChange = (e) => {
    const { name, value } = e.target;
    setContaData({ ...contaData, [name]: value });
  };

  // Submete o formulário para adicionar uma nova conta
  const handleContaSubmit = async (e) => {
    e.preventDefault();
    const id = userInfo.id_EmpresaDb
      ? userInfo.id_EmpresaDb
      : userInfo.id_EmpresaDb;

    if (!id) {
      alert("ID da empresa não encontrado.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/ServerTwo/registrarContas/${id}`,
        { ...contaData, plano: selectedPlano } // Adiciona o plano automaticamente
      );
      alert(response.data.message);
      // Limpar os campos após o envio
      setContaData({
        codigo_reduzido: "",
        descricao: "",
        mascara: "",
        orientacao: "",
        tipo: "",
        userId: "",
        userName: "",
      });
    } catch (error) {
      console.error("Erro ao registrar conta:", error);
      alert("Erro ao registrar conta.");
    }
  };

  // Renderiza o conteúdo com base na aba ativa
  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case "Planos de Contas":
        return (
          <div>
            <h3>Plano de Contas</h3>
            <div className="DadosPlano">
              <div className="title-dados">
                <h3>Dados</h3>
              </div>
              <div className="nome-dados">
                <h4>Nome</h4>
                <select
                  className="select"
                  onChange={(e) => {
                    const selected = planos.find(
                      (plano) => plano.codigo_plano === e.target.value
                    );
                    setSelectedPlano(selected); // Armazena o plano selecionado corretamente
                  }}
                  value={selectedPlano ? selectedPlano.codigo_plano : ""}
                >
                  {planos && planos.length > 0 ? (
                    planos.map((plano) => (
                      <option
                        key={plano.codigo_plano}
                        value={plano.codigo_plano}
                      >
                        {plano.descricao}
                      </option>
                    ))
                  ) : (
                    <option value="">Nenhum plano disponível</option>
                  )}
                </select>
              </div>
            </div>
            <div className="items-planos">
              <div className="planodecontas-item">
                <div className="header-item">
                  <h4>Item do Plano de Conta</h4>
                </div>
                <PlanoDeContas
                  empresaId={userInfo.id_EmpresaDb}
                  selectedPlano={selectedPlano}
                />
              </div>
              <div className="edit-item">
                <div className="header-item">
                  <h4>Adicionar Conta</h4>
                </div>
                <div className="form-item">
                  <form onSubmit={handleContaSubmit}>
                    <label>Código Reduzido</label>
                    <input
                      className="codigo"
                      name="codigo_reduzido"
                      value={contaData.codigo_reduzido}
                      onChange={handleContaChange}
                      required
                    />
                    <label>Descrição</label>
                    <input
                      name="descricao"
                      value={contaData.descricao}
                      onChange={handleContaChange}
                      required
                    />
                    <label>Máscara</label>
                    <input
                      name="mascara"
                      value={contaData.mascara}
                      onChange={handleContaChange}
                      required
                    />
                    <label>Orientação</label>
                    <select
                      name="orientacao"
                      value={contaData.orientacao}
                      onChange={handleContaChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Crédito">Crédito</option>
                      <option value="Débito">Débito</option>
                      <option value="Ambos">Ambos</option>
                    </select>
                    <label>Tipo de conta</label>
                    <select
                      name="tipo"
                      value={contaData.tipo}
                      onChange={handleContaChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="Sintética">Sintética</option>
                      <option value="Analítica">Analítica</option>
                    </select>
                    <button className="button-update" type="submit">
                      Salvar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      case "Planos":
        return <PlanosForm />;
      default:
        return <div>Conteúdo padrão</div>;
    }
  };

  return (
    <div className="planos">
      <h1>Planos e Contas</h1>
      <div className="abas">
        <button onClick={() => setAbaAtiva("Planos de Contas")}>
          Planos de Contas
        </button>
        <button onClick={() => setAbaAtiva("Planos")}>Planos</button>
      </div>
      {renderizarConteudo()}
    </div>
  );
}

export default PlanoDContas;
