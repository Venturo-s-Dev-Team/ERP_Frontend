import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./balancete.css";

function Balancete() {
  const [input, setInput] = useState("");
  const [planos, setPlanos] = useState([]); // Lista de planos de contas
  const [contas, setContas] = useState([]); // Lista de contas
  const [filteredContas, setFilteredContas] = useState([]); // Contas filtradas por plano
  const [selectedPlano, setSelectedPlano] = useState(""); // Plano de contas selecionado
  const [userInfo, setUserInfo] = useState({}); // Informações do usuário logado

  // Função para buscar os planos de contas da API
  const fetchPlanos = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tablePlanos/${id}`);
      console.log("Planos response:", response); // Logar a resposta completa da API
      if (response.data && Array.isArray(response.data.InfoTabela)) {
        setPlanos(response.data.InfoTabela); // Verificar se InfoTabela é um array
      } else {
        console.error("Formato inesperado da resposta de planos:", response.data);
        alert("Erro: o formato dos dados recebidos não é o esperado.");
      }
    } catch (error) {
      console.error("Erro ao buscar planos de contas:", error);
      alert("Erro ao buscar planos de contas.");
    }
  };

  // Função para buscar todas as contas da API
  const fetchContas = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableContas/${id}`);
      console.log("Contas response:", response); // Logar a resposta completa da API
      if (response.data && Array.isArray(response.data.InfoTabela)) {
        setContas(response.data.InfoTabela); // Verificar se InfoTabela é um array
      } else {
        console.error("Formato inesperado da resposta de contas:", response.data);
        alert("Erro: o formato dos dados recebidos não é o esperado.");
      }
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      alert("Erro ao buscar contas.");
    }
  };

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
      }
    } catch (error) {
      console.error("Token inválido", error);
    }
  };

  // Carregar os planos e contas ao montar o componente
  useEffect(() => {
    verifyToken(); // Obtém as informações do usuário
  }, []);

  // Quando o userInfo mudar, busque os planos e contas
  useEffect(() => {
    if (userInfo.id_user || userInfo.id_EmpresaDb) {
      const id = userInfo.id_EmpresaDb || userInfo.id_user;
      console.log("Buscando planos e contas para o ID:", id); // Verificar se o ID está correto
      fetchPlanos(id);
      fetchContas(id);
    }
  }, [userInfo]);

  // Filtrar as contas quando o plano for selecionado
  useEffect(() => {
    if (selectedPlano) {
      const planoId = parseInt(selectedPlano);
      const filtered = contas.filter((conta) =>
        conta.mascara.startsWith(planoId.toString())
      );
      setFilteredContas(filtered);
    }
  }, [selectedPlano, contas]);

  // Função para buscar dados quando há input na barra de busca
  const handleSearchChange = (value) => {
    setInput(value);
    if (value) {
      const results = filteredContas.filter((conta) =>
        conta.descricao.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredContas(results);
    } else {
      const planoId = parseInt(selectedPlano);
      const resetFiltered = contas.filter((conta) =>
        conta.mascara.startsWith(planoId.toString())
      );
      setFilteredContas(resetFiltered);
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Balancete</h3>
      </div>

      {/* Dropdown para selecionar o plano de contas */}
      <div className="plano-selector">
        <label>Selecione o Plano de Contas: </label>
        <select
          value={selectedPlano}
          onChange={(e) => setSelectedPlano(e.target.value)}
          className="select-plano"
        >
          <option value="">Selecione</option>
          {planos.length > 0 ? (
            planos.map((plano) => (
              <option key={plano.codigo_plano} value={plano.codigo_plano}>
                {plano.descricao}
              </option>
            ))
          ) : (
            <option value="">Nenhum plano encontrado</option>
          )}
        </select>
      </div>

      {/* Tabela do Balancete */}
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
            {filteredContas.map((conta) => (
              <tr key={conta.codigo_reduzido}>
                <td>{conta.grupo}</td>
                <td>{conta.descricao}</td>
                <td>{conta.mascara}</td>
                <td>{conta.saldo}</td>
                <td>{conta.entrada}</td>
                <td>{conta.saida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Balancete;
