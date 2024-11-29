import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Venturo from "../../images/Venturo.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CgCloseR } from "react-icons/cg";
import "./dashboardAdmin.css";
import "../../App.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function HomeAdmin() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(null);
  const [datatatus, setdatatatus] = useState({});
  const [userInfo, setUserInfo] = useState('');
  const [data, setData] = useState([]);

  // Função para alterar o status localmente
  const status = (id) => {
    setdatatatus((prevStatus) => ({
      ...prevStatus,
      [id]: prevStatus[id] === "Autorizado" ? "Desautorizado" : "Autorizado",
    }));
  };

  // Função para desautorizar empresa
  const Desautorizado = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/desautorizar/${id}`, { id_user: userInfo.id_user, Nome_user: userInfo.Nome_user }, {
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
      const response = await axios.get(`/api/ServerOne/autorizar/${id}`, { id_user: userInfo.id_user, Nome_user: userInfo.Nome_user }, {
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
          setdatatatus(statusMap);
        }
      } catch (err) {
        console.error("Erro: ", err);
      }
    };
    fetchData();
  }, []);

  const selectedItem = data.find((item) => item.id === selectedId);

  const handleProsseguir = (id) => {
      navigate("/verMais", {
        state: { id },
      })
  };

  return (
    <SideBarPage>
      <main>
        {/* Texto de boas vindas e introdução */}
        <div className="scroll-despesas">
          <div>
            <h1 className="main-titleDBAdmin">Bem-Vindo ao Venturo!</h1>
            <h4 className="IntroText-DBAdmin-1">
              O Venturos é a solução definitiva para a gestão de recursos
              empresariais,
            </h4>
            <h4 className="IntroText-DBAdmin-2">
              projetado especialmente para atender às necessidades de super
              administradores
            </h4>
            <h4 className="IntroText-DBAdmin-3">
              como você. Explore as funcionalidades e traga mais eficiência e
              clareza para suas operações.
            </h4>
          </div>

          <div className="ContainerEmp-DBAdmin">
            {/* Container - Parte Externa */}
            {data.map((item) => (
              <motion.div
                layoutId={item.id}
                className="ContainerExt-DBAdmin"
                onClick={() => setSelectedId(item.id)}
              >
                <motion.h5>{item.subtitle}</motion.h5>
                <motion.h2>{item.title}</motion.h2>
                <motion.h6>Status: {item.status}</motion.h6>
              </motion.div>
            ))}
            {/* Container - Parte Interna */}
            <AnimatePresence>
  {selectedId &&
    data
      .filter((item) => item.id === selectedId) // Filtra o item selecionado
      .map((item) => (
        <motion.div
          layoutId={selectedId}
          className="ContainerInt-DBAdmin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={item.id}
        >
          {/* Div - Botão de Fechar do Container */}
          <motion.div>
            <motion.button
              className="ContainerBtn-DBAdmin"
              onClick={() => setSelectedId(null)}
            >
              <CgCloseR className="ContainerIcone" />
            </motion.button>
          </motion.div>

          {/* Div - Container com Logo */}
          <motion.div className="LogoEmpresa-DBAdmin">
            {/* Logo da empresa */}
            {item.logo ? (
              <img
                src={`/api/ServerOne/uploads/Logo/${item.logo}`}
                className="LogoEmpresa-Img-DBAdmin"
                alt="Logo"
              />
            ) : (
              <div style={{ width: 100, height: 100 }}></div>
            )}
          </motion.div>

          {/* Div - Container sem logo */}
          <motion.div
            className={`ContainerConteudo ${item.logo ? "has-logo" : "no-logo"}`}
          >
            <motion.h2 className="ContainerInt-Title">{item.title}</motion.h2>
            <motion.h6 className="ContainerInt-Dados">Status: {item.status}</motion.h6>

            {/* Dados da Empresa */}
            <details>
              <summary className="Summary-ContainerInt">Dados da Empresa</summary>
              <motion.p className="Dados-ContainerInt">
                <strong> ID: </strong> {item.id}{" "}
              </motion.p>
              <motion.p className="Dados-ContainerInt">
                <strong> Gestor: </strong> {item.gestor}{" "}
              </motion.p>
              <motion.p className="Dados-ContainerInt">
                <strong> CNPJ: </strong> {item.cnpj}
              </motion.p>
              <motion.p className="Dados-ContainerInt">
                <strong> Email: </strong> {item.email}
              </motion.p>
            </details>

            {/* Botões para "Ver Mais" e "Autorizar" */}
            <motion.div className="ContainerInt-BtnBox">
              <motion.button
                className={
                  item.status === "Autorizado"
                    ? "Desautorizar-DBAdmin"
                    : "Autorizar-DBAdmin"
                }
                onClick={() => {
                  // Verifica o status e chama a função apropriada
                  if (item.status === "Autorizado") {
                    Desautorizado(selectedId); // Desautorizar quando o status for "Autorizado"
                  } else {
                    Autorizado(selectedId); // Autorizar quando o status for "Desautorizado"
                  }
                }}
              >
                {item.status === "Autorizado" ? "Desativar" : "Autorizar"}
              </motion.button>

              <motion.div className="VerMaisDiv-DBAdmin">
                <motion.button className="VerMaisBtn-DBAdmin" onClick={() => handleProsseguir(item.id)}> Ver Mais </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
</AnimatePresence>

          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default HomeAdmin;
