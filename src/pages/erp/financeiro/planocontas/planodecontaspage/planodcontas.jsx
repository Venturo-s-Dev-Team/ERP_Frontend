import React, { useState, useEffect } from "react";
import "./planodcontas.css";
import PlanosForm from "./planos.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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
const PlanoDeContas = ({ empresaId }) => {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  useEffect(() => {
    fetchContas('Crédito', setReceitas); // Busca as contas de crédito para receitas
    fetchContas('Débito', setDespesas); // Busca as contas de débito para despesas
  }, [empresaId]);

  const fetchContas = async (orientacao, setState) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableContas/${empresaId}/${orientacao}`);
      setState(response.data); // Altera o estado com as contas retornadas
    } catch (error) {
      console.error(`Erro ao buscar contas de ${orientacao}:`, error);
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
      const response = await axios.get(`/api/ServerOne/tablePlanos/${id}`); // Ajuste para incluir o ID da empresa
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
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_EmpresaDb;

    if (!id) {
      alert("ID da empresa não encontrado.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/ServerTwo/registrarContas/${id}`,
        contaData
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
                <select className="select">
                  {planos && planos.length > 0 ? (
                    planos.map((plano) => (
                      <option key={planos.codigo_plano} value={planos.codigo_plano}>
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
                <PlanoDeContas empresaId={userInfo.id_EmpresaDb} />
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
        return null;
    }
  };

  return (
    <main className="main-container">
      <div className="header-plano">
        <button
          className="button-plano"
          onClick={() => setAbaAtiva("Planos de Contas")}
        >
          Plano de Contas
        </button>
        <button className="button-plano" onClick={() => setAbaAtiva("Planos")}>
          Cadastrar Planos
        </button>
      </div>
      {renderizarConteudo()}
    </main>
  );
}

export default PlanoDContas;
