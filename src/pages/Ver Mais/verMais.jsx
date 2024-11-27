import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import "./verMais.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import { IoReturnUpBack } from "react-icons/io5";

function verMais() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dados } = location.state || {};
  const [userInfo, setUserInfo] = useState({});
  const [empresa, setEmpresa] = useState(null); 

  useEffect(() => {
    setEmpresa({
      nome: "Nome da Empresa",
      imagem: "caminho/da/imagem.jpg", 
    });
  }, []);

  return (
    <SideBarPage>
      <main>

      <div className="scroll-despesas">
        <button className="Btn-Voltar"> <IoReturnUpBack size={40} />
 </button>
          <div className="Container-VerMais">
         
          <h1>Nome da Empresa</h1>
          <h3>Inscrição Estadual: {dados.ie}</h3>
          <h3>Site: </h3>
          <h3>Munícipio: </h3>
          <h3>CEP: {dados.cep}</h3>
          <h3>Logradouro: </h3>
          <h3>Uf:</h3>
          <h3>Números: </h3>
          <h3>Complemento: </h3>
          <h3>Telefone:</h3>
          <h3>CPF:</h3>
          <h3>RG:</h3>
          
          {empresa?.imagem ? (
              <div className="ImageContainer">
                <img src={empresa.imagem} alt="Imagem da empresa" className="Imagem" />
              </div>
            ) : null}
          </div>
        </div>
        <div className="Arquivos">
          <h2>Arquivos</h2>
          <h4>Contrato Social:</h4>
          <h4>Requerimento de Empresário:</h4>
          <h4>Certificado MEI:</h4>
          </div>
      </main>
    </SideBarPage>
  );
}

export default verMais;
