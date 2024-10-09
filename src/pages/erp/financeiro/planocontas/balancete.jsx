import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./balancete.css";

function Balancete() {
  const [input, setInput] = useState("");
  const [planos, setPlanos] = useState([]);
  const [contas, setContas] = useState([]);
  const [filteredContas, setFilteredContas] = useState([]);
  const [lancamentos, setLancamentos] = useState([]); // Adicionando estado para os lançamentos
  const [selectedPlano, setSelectedPlano] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const fetchPlanos = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tablePlanos/${id}`);
      if (response.data && Array.isArray(response.data)) {
        setPlanos(response.data);
      } else {
        console.error("Formato inesperado da resposta de planos:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar planos de contas:", error);
    }
  };

  const fetchContas = async (id, orientacao = "Ambos") => {
    try {
      const response = await axios.get(`/api/ServerOne/tableContas/${id}/${orientacao}`);
      if (response.data && Array.isArray(response.data)) {
        setContas(response.data);
      } else {
        console.error("Formato inesperado da resposta de contas:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  const fetchLancamentos = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableLancamentoContabil/${id}`);
      if (response.data && Array.isArray(response.data)) {
        setLancamentos(response.data);
      } else {
        console.error("Formato inesperado da resposta de lançamentos contábeis:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar lançamentos contábeis:", error);
    }
  };

  const verifyToken = async () => {
    try {
      const response = await axios.get("/api/ServerTwo/verifyToken", { withCredentials: true });
      if (typeof response.data.token === "string") {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      }
    } catch (error) {
      console.error("Token inválido", error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_user || userInfo.id_EmpresaDb) {
      const id = userInfo.id_EmpresaDb || userInfo.id_user;
      fetchPlanos(id);
      fetchContas(id);
      fetchLancamentos(id); // Carrega os lançamentos contábeis para o balancete
    }
  }, [userInfo]);

  useEffect(() => {
    if (selectedPlano) {
      const filtered = contas.filter((conta) => conta.mascara.startsWith(selectedPlano));
      setFilteredContas(filtered);
    } else {
      setFilteredContas(contas);
    }
  }, [selectedPlano, contas]);

  const handleSearchChange = (value) => {
    setInput(value);
    const results = filteredContas.filter((conta) =>
      conta.descricao.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredContas(results);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Balancete</h3>
      </div>

      <div className="plano-selector">
        <label>Selecione o Plano de Contas: </label>
        <select value={selectedPlano} onChange={(e) => setSelectedPlano(e.target.value)} className="select-plano">
          <option value="">Selecione</option>
          {planos.length > 0 ? (
            planos.map((plano) => (
              <option key={plano.codigo_plano} value={plano.mascara}>
                {plano.descricao}
              </option>
            ))
          ) : (
            <option value="">Nenhum plano encontrado</option>
          )}
        </select>
      </div>

      <div className="Balancete_List">
        <table>
          <caption>Relatório Balancete</caption>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Descrição</th>
              <th>Conta</th>
              <th>Saldo</th>
              <th>Entrada</th>
              <th>Saída</th>
            </tr>
          </thead>
          <tbody>
            {filteredContas.map((conta) => {
              const entradas = lancamentos
                .filter((lancamento) => lancamento.debito_conta === conta.codigo_reduzido)
                .reduce((acc, lancamento) => acc + parseFloat(lancamento.debito_valor), 0);

              const saidas = lancamentos
                .filter((lancamento) => lancamento.credito_conta === conta.codigo_reduzido)
                .reduce((acc, lancamento) => acc + parseFloat(lancamento.credito_valor), 0);

              return (
                <tr key={`${conta.codigo_reduzido}-${conta.descricao}`}>
                  <td>{conta.orientacao}</td>
                  <td>{conta.descricao}</td>
                  <td>{conta.mascara}</td>
                  <td>{conta.saldo || 0}</td>
                  <td>{entradas || 0}</td>
                  <td>{saidas || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Balancete;
