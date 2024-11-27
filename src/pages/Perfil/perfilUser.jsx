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
        "Gerente"
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
                      src={`/api/ServerOne/uploads/Logo/${userInfo.id_EmpresaDb}.png`}
                      className="LogoEmpresa-Img-DBAdmin"                    
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
      } else if (userInfo.RazaoSocial) {
        return (
          <div>
            <footer >
                {!userInfo.Logo ? (
                  <div>Perfil</div>
                ) : (
                  <img
                    src={`/api/ServerOne/uploads/Logo/${userInfo.Logo}`}
                    style={{ width: 270, height: 270 }}
                    alt=""
                  />
                )}
              <div >
                <h2 className="perfil-titulo-rs">Dados do Perfil</h2>
                <p className="perfil-id-rs">ID: {userInfo.id_user}</p>
                <p className="perfil-nome-rs">Nome: {userInfo.Nome_user}</p>
                <p className="perfil-empresa-rs">
                  Empresa: {userInfo.RazaoSocial}
                </p>
                <p className="perfil-email-rs">E-mail: {userInfo.Email}</p>
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
