import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Popupstyle.css"; // Certifique-se de que este arquivo contém a estilização fornecida

const SuccessPopup = ({ onClose, onSubmit }) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [typeUser, setTypeUser] = useState("");
  const [EmpresaId, setIdEmpresa] = useState("");
  const [erro, setErro] = useState("");
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
          setIdEmpresa(decodedToken.id_user);
        } else {
          console.error("Token não é uma string:", response.data.token);
        }
      } catch (error) {
        console.error("Token inválido", error);
      }
    };

    verifyToken();
  }, []);

  const generateEmail = (nome) => {
    return nome.toLowerCase().replace(/\s+/g, ".") + "@venturo.com";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/ServerTwo/cadastro_funcionario", {
        Nome: nome,
        Senha: senha,
        TypeUser: typeUser,
        Email: generateEmail(nome),
        id: userInfo.id_EmpresaDb,

        // Info para Logs
        id_EmpresaDb: userInfo.id_EmpresaDb,
        userId: userInfo.id_user,
        userName: userInfo.Nome_user,
      });

      if (response.status === 200) {
        onSubmit(); // Executa a função para fechar o pop-up
        window.location.reload();
      }
    } catch (error) {
      setErro(
        "Erro ao cadastrar funcionário. Verifique os dados e tente novamente."
      );
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>Cadastro de Funcionário</h3>
          <span className="popup-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <select
              value={typeUser}
              onChange={(e) => setTypeUser(e.target.value)}
              required
            >
              <option value="">Selecione o cargo</option>
              <option value="Socio">Sócio</option>
              <option value="Gerente">Gerente</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Estoque">Estoque</option>
              <option value="Venda">Venda</option>
              <option value="Caixa">Caixa</option>
            </select>
            {erro && <p className="error">{erro}</p>}
            <div className="popup-footer">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
