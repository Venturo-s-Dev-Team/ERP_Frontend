import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./razao.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Razao() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  const [Despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);

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

    // Carregar dados inicialmente
    useEffect(() => {
      if (userInfo && userInfo.id_EmpresaDb) {
        fetchDespesas(userInfo.id_EmpresaDb);
        fetchReceitas(userInfo.id_EmpresaDb);
      }
    }, [userInfo]);
  
    // Função para carregar dados do banco de dados
    const fetchDespesas = async (userId) => {
      try {
        const despesasResponse = await axios.get(
          `/api/ServerOne/tabledespesas/${userId}`,
          { withCredentials: true }
        );
  
        const despesas = despesasResponse.data.InfoTabela;
        setDespesas(despesas);
  
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };

    const fetchReceitas = async (id) => {
      try {
        const response = await axios.get(`/api/ServerOne/tablereceitas/${id}`, { withCredentials: true });
        setReceitas(response.data.InfoTabela);
      } catch (error) {
        console.error("Erro ao carregar receitas", error);
      }
    };

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Razão</h3>
        </div>

        <div className="scroll-despesas">
          {/* Search Bar começa aqui */}

          {/*<div className="results-list">
            {results.map((result, id) => {
              return (
                <div
                  key={id}
                  className="search-result"
                  onClick={(e) => alert(`You clicked on ${result.name}`)}
                >
                  {result.name}
                </div>
              );
            })}
          </div>*/}
        </div>

        {/* Search Bar termina */}
        <div className="Razao_List">
          <table>
            <caption>Livro Razão</caption>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Grupo</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
            {/*}  {tabelas.map((tabela) => (
                <tr key={tabela.id}>
                  <td>{tabela.data}</td>
                  <td>{tabela.descricao}</td>
                  <td>{tabela.grupo}</td>
                  <td> {tabela.saldo}</td>
                </tr>
              ))}*/}
            </tbody>
          </table>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Razao;