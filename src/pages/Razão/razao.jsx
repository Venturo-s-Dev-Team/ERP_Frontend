import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./razao.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

// Importação dos utilitários de data
import { formatarData, converterDataHora } from "../../utils/dateUtils";

function Razao() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState('');
  const [Despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [pagaments, setPagaments] = useState([]);
  const [tabelaDados, setTabelaDados] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

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
      fetchPagamentos();
    }
  }, [userInfo]);

  // Função para carregar dados do banco de dados
  const fetchDespesas = async (userId) => {
    try {
      const despesasResponse = await axios.get(`/api/ServerOne/tabledespesas/${userId}`, { withCredentials: true });
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

  const fetchPagamentos = async () => {
    try {
      const response = await axios.get(`/api/ServerOne/tablepagamentos`, { withCredentials: true });
      setPagaments(response.data.InfoTabela);
    } catch (error) {
      console.error("Erro ao carregar pagamentos: ", error);
    }
  };

  // Função para combinar todos os dados
  useEffect(() => {
    const combinarDados = () => {
      // Mapear as despesas, receitas e pagamentos para o formato comum
      const despesasCompletas = Despesas.map(item => ({
        nome: item.Nome,
        valor: item.Valor,
        data: item.DataExpiracao,
      }));

      const receitasCompletas = receitas.map(item => ({
        nome: item.Nome,
        valor: item.Valor,
        data: item.DataExpiracao,
      }))

      const pagamentosCompletos = pagaments.map(item => ({
        nome: item.Nome,
        valor: item.Valor,
        data: item.Data,
      }));

      // Combinar tudo em um único array
      setTabelaDados([...despesasCompletas, ...receitasCompletas, ...pagamentosCompletos]);
    };

    if (Despesas.length && receitas.length && pagaments.length) {
      combinarDados();
    }
  }, [Despesas, receitas, pagaments]);

    // Filtro das receitas
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
    };
  
    const filteredDados = tabelaDados.filter(
      (items) =>
      items.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.data.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Razão</h3>
        </div>
        
<div className="scroll-despesas">
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
              placeholder="Pesquisar..."
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
        <div className="Razao_List">
          <table>
            <caption>Livro Razão</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredDados.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>{item.valor}</td>
                  <td>{formatarData(item.data)}</td>
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

export default Razao;