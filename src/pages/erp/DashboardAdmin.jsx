import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Venturo from "../../images/Venturo.png";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CgCloseR } from "react-icons/cg";
import "./DashboardAdmin.css";


function DashboardAdmin() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [itemStatus, setItemStatus] = useState({});
  const [userInfo, setUserInfo] = useState('');
  const [data, setData] = useState([]);

  // Função para alterar o status localmente
  const status = (id) => {
    setItemStatus((prevStatus) => ({
      ...prevStatus,
      [id]: prevStatus[id] === "Autorizado" ? "Desautorizado" : "Autorizado",
    }));
  };

  // Função para desautorizar empresa
  const Desautorizado = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/desautorizar/${id}`, {id_user: userInfo.id_user, Nome_user: userInfo.Nome_user}, {
        withCredentials: true,
      });
      if (response) {
        alert("Empresa desautorizada. A página será recarregada.");
        window.location.reload(); // Recarrega a página
      }
    } catch (err) {
      console.error("Erro: ", err);
    }
  };

  // Função para autorizar empresa
  const Autorizado = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/autorizar/${id}`, {id_user: userInfo.id_user, Nome_user: userInfo.Nome_user}, {
        withCredentials: true,
      });
      if (response) {
        alert("Empresa autorizada. A página será recarregada.");
        window.location.reload(); // Recarrega a página
      }
    } catch (err) {
      console.error("Erro: ", err);
    }
  };

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

  // Função para buscar dados das empresas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const Info = await axios.get("/api/ServerOne/tableEmpresas", {
          withCredentials: true,
        });

        console.log(Info)

        if (Info.status === 200) {
          const fetchedData = Info.data.InfoTabela.map((item) => ({
            id: item.id,
            subtitle: "Gestão de Empresas",
            title: item.RazaoSocial,
            color: "#0A5483",
            status: item.Autorizado === "YES" ? "Autorizado" : "Desautorizado",
            gestor: item.Gestor,
            cnpj: item.CNPJ,
            email: item.email,
            logo: item.Logo,
          }));
          setData(fetchedData);

          const statusMap = {};
          fetchedData.forEach((item) => {
            statusMap[item.id] = item.status;
          });
          setItemStatus(statusMap);
        }
      } catch (err) {
        console.error("Erro: ", err);
      }
    };
    fetchData();
  }, []);

  const selectedItem = data.find((item) => item.id === selectedId);

  return (
    <div className="main-container">
      {/* Textos de boas vindas e introdução */}
      <div className="intro">
        <div className="main-title">
          <h1 className="main-titulo">Bem-Vindo ao Venturo!</h1>
        </div>
        <h4 className="texto-secundario1">
          O Venturos é a solução definitiva para a gestão de recursos empresariais,
        </h4>
        <h4 className="texto-secundario2">
          projetado especialmente para atender às necessidades de super administradores
        </h4>
        <h4 className="texto-secundario3">
          como você. Explore as funcionalidades e traga mais eficiência e clareza para suas operações.
        </h4>
      </div>

      <div className="items-container">
        {/* Container - Box das empresas */}
        {data.map((item) => (
          <motion.div
            key={item.id}
            className="item-box"
            style={{ backgroundColor: item.color }}
            layoutId={item.id}
            onClick={() => setSelectedId(item.id)}
          >
            <motion.div>
              <motion.h5>{item.subtitle}</motion.h5>
              <motion.h2 className="nome-da-empresa-dashboard">{item.title}</motion.h2>
              <motion.h6 className="status">Status: {itemStatus[item.id]}</motion.h6>
            </motion.div>
          
          </motion.div>
        ))}

{/* Parte de dentro dos containers das empresas */}
        <AnimatePresence>
          {selectedId && selectedItem && (
            <motion.div
              className="item-detail"
              layoutId={selectedId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Botão de fechar */}
              <motion.div className="div-fecharbtn">
                <motion.button
                  className="close_btn"
                  onClick={() => setSelectedId(null)}
                >
                 <CgCloseR className="icone"/>
                </motion.button>
              </motion.div>

{/* Nome da empresa e a logo */}
      <motion.div className="div-statusbtn">
                <motion.div >
<motion.div className="logo-e-btn">
    {/* Logo da empresa */}
                {selectedItem.logo ? (
                  <img
                    src={`/api/ServerOne/uploads/Logo/${selectedItem.logo}`}
                    className="img-empresa"
                    alt="Logo"
                  />
                ) : (
                  <div style={{ width: 100, height: 100 }}></div>
                )}

             </motion.div>
          </motion.div>
              
        <motion.div className={`conteudo ${selectedItem.logo ? 'has-logo' : 'no-logo'}`}>
                <motion.h2 className="letras-titulo">{selectedItem.title}</motion.h2>
                <motion.h6 className="letras-status">Status: {itemStatus[selectedId]}</motion.h6>

               {/* Botão de autorizar */}
  {/* Dados da empresa */}
  <motion.div >
          <motion.div className="dados">
              <details>
                <summary className="dados-titulo">Dados da empresa</summary>
                <motion.div >
                  <motion.p className="letras-more-info1"><strong>ID:</strong> {selectedItem.id}</motion.p>
                  <motion.p className="letras-more-info2"><strong>Gestor:</strong> {selectedItem.gestor}</motion.p>
                  <motion.p className="letras-more-info3"><strong>CNPJ:</strong> {selectedItem.cnpj}</motion.p>
                  <motion.p className="letras-more-info4"><strong>Email:</strong> {selectedItem.email}</motion.p>
                </motion.div>
              </details>
            </motion.div>
      </motion.div>
              
              
              </motion.div>
              

  <motion.div className="div-dashboard-desa">
              
                <motion.div className="btn-status">
                {itemStatus[selectedId] === "Autorizado" ? (
            
                  <motion.button
                  
  
  className="status-button-desautorizar"
                    onClick={() => Desautorizado(selectedId)}
                    type="button"
                  >
                    Desativar
                  </motion.button>
                ) : (
                  <motion.button
                  
  className="status-button-autorizar"
                    onClick={() => Autorizado(selectedId)}
                    type="button"
                  >
                    Autorizar
                  </motion.button> 
                )} </motion.div>

                <motion.div className="btn-ver-mais-div">
                  <motion.button className="btn-ver-mais-dashboard">
                    Ver mais
                    </motion.button>
                  </motion.div>
              </motion.div>
            </motion.div> 
            
            </motion.div>
            
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardAdmin;