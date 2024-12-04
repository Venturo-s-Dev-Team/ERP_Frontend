import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./perfilUser.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const Perfil = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
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

    verifyToken();
  }, [navigate]);

  const Body = () => {
    if (userInfo) {
      if (userInfo.TypeUser === "SuperAdmin") {
        return (
          <div className="perfil-body">
            <div className="perfil-info">
              <p className="perfil-id">ID: {userInfo.id_user}</p>
              <p className="perfil-nome">Nome: {userInfo.Nome_user}</p>
              <p className="perfil-email">E-mail: {userInfo.Email}</p>
            </div>
          </div>
        );
      } else if (
        userInfo.TypeUser === "Financeiro" ||
        "Estoque" ||
        "Venda" ||
        "Socio" ||
        "Gerente" ||
        "Gestor"
      ) {
        return (

          <div className="perfil-body">
            <footer >
              <div className="perfil-details">
                <div className="perfil-summary">
                  {!userInfo.id_EmpresaDb ? (
                    <div>Vazio</div>
                  ) : (
                    <img
                      src={`/api/ServerOne/uploads/Logo/${userInfo.id_EmpresaDb}.jpeg`}
                      className="LogoEmpresa-Img-DBAdmin"
                      alt="Logo da Empresa"
                      onError={(e) => {
                        const fallbackFormats = ["png", "jpg"];
                        let currentFormatIndex = fallbackFormats.findIndex((format) =>
                          e.target.src.endsWith(format)
                        );

                        if (currentFormatIndex === -1) currentFormatIndex = 0; // Primeiro erro tenta PNG

                        if (currentFormatIndex < fallbackFormats.length - 1) {
                          // Atualiza o formato da imagem para o próximo na lista
                          e.target.src = `/api/ServerOne/uploads/Logo/${userInfo.id_EmpresaDb}.${fallbackFormats[currentFormatIndex + 1]
                            }`;
                        } else {
                          // Caso todas as alternativas falhem, exibe uma imagem padrão
                          e.target.src = "/default-image-path/default-logo.png";
                        }
                      }}
                    />
                  )}
                </div>
                <div className="Perfil-Dados">

                  <h2 className="Perfil-Empresa">Dados do Perfil</h2>
                  <p className="perfil-id">ID: {userInfo.id_user}</p>
                  <p className="perfil-nome">Nome: {userInfo.Nome_user}</p>
                  <p className="perfil-email">E-mail: {userInfo.Email}</p>
                  <p> Função: {userInfo.TypeUser}</p>
                </div>
              </div>
            </footer>
          </div>
        );
      }
    } else {
      return <p>Carregando...</p>;
    }
  };

  return (
    <SideBarPage>
      <div className="perfil-container">
        <h1 className="perfil-header">Perfil</h1>
        <Body />
      </div>
    </SideBarPage>
  );
};

export default Perfil;