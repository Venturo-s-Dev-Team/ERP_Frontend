import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import "./verMais.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import { IoReturnUpBack } from "react-icons/io5";

function VerMais() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [userInfo, setUserInfo] = useState({});
  const [empresa, setEmpresa] = useState(null); // Iniciar como null para verificar se os dados foram carregados
  const [loading, setLoading] = useState(true);  // Flag de carregamento
  const [error, setError] = useState(null);      // Flag de erro

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
    DadosDaEmpresa();
  }, [navigate]);

  const DadosDaEmpresa = async () => {
    try {
      setLoading(true); // Começa o carregamento
      const response = await axios.get(`/api/ServerOne/SelectInfoEmpresa/${id}`, { withCredentials: true });

      if (response.data && response.data.InfoEmpresa) {
        setEmpresa(response.data.InfoEmpresa);
      } else {
        setError("Empresa não encontrada");
      }
    } catch (err) {
      setError("Erro ao carregar dados da empresa");
      console.error("Não foi possível realizar a busca das informações: ", err);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    alert("Erro ao carregar as informações");
    console.log("Erros: ", error)
  }

  return (
    <SideBarPage>
      <main>
        <div className="scroll-despesas">
          <button className="Btn-Voltar" onClick={() => navigate("/dashboardAdmin")} > <IoReturnUpBack size={40} /> </button>
          <div className="Container-VerMais">
            <h1>{empresa?.RazaoSocial}</h1>
            <h3>Inscrição Estadual: {empresa?.InscricaoEstadual}</h3>
            <h3>Site: {empresa?.Site}</h3>
            <div className="Localização">
            <h2>Localização</h2>
            <h3>Munícipio: {empresa?.Municipio}</h3>
            <h3>CEP: {empresa?.CEP}</h3>
            <h3>Logradouro: {empresa?.Logradouro}</h3>
            <h3>UF: {empresa?.UF}</h3>
            <h3>Números: {empresa?.Numero}</h3>
            <h3>Complemento: {empresa?.Complemento}</h3>
            </div>
            <h2>Dados do cadastrante</h2>
            <h3>Telefone: {empresa?.Telefone}</h3>
            <h3>CPF: {empresa?.CPF}</h3>
            <h3>RG: {empresa?.RG}</h3>
           
          </div>
        <div className="Arquivos">
          <h2>Arquivos</h2>
          <h4>Contrato Social:
            <a 
            href={`/api/ServerOne/uploads/Docs/CadastroEmpresas/${empresa.ContratoSocial}`} > {empresa.ContratoSocial}
            </a>
          </h4>
          <h4>Requerimento de Empresário: 
            <a 
            href={`/api/ServerOne/uploads/Docs/CadastroEmpresas/${empresa.RequerimentoEmpresario}`} > {empresa.RequerimentoEmpresario}
            </a>
          </h4>
          <h4>Certificado MEI: 
            <a 
            href={`/api/ServerOne/uploads/Docs/CadastroEmpresas/${empresa.CertificadoMEI}`} > {empresa.CertificadoMEI}
            </a>
          </h4>
        </div>
                </div>

        
      </main>
    </SideBarPage>
  );
}

export default VerMais;
