import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Popupstyle.css"; // Certifique-se de que este arquivo contém a estilização fornecida

const SuccessPopup = ({ onClose, onSubmit }) => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [typeUser, setTypeUser] = useState("");
  const [cpf, setCPF] = useState("");
  const [emailPessoal, setEmailPessoal] = useState("");
  const [EmpresaId, setIdEmpresa] = useState("");
  const [erro, setErro] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false); // To show a loading spinner while submitting

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

  // Function to generate email based on name
  const generateEmail = (nome) => {
    return nome.toLowerCase().replace(/\s+/g, ".") + "@venturo.com";
  };

  // Function to validate the form
  const validateForm = () => {
    if (!nome || !senha || !cpf || !emailPessoal || !typeUser) {
      setErro("Todos os campos são obrigatórios.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(emailPessoal)) {
      setErro("O e-mail pessoal fornecido é inválido.");
      return false;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First validate the form
    if (!validateForm()) return;

    setIsLoading(true); // Show loading spinner

    try {
      const response = await axios.post("/api/ServerTwo/cadastro_funcionario", {
        Nome: nome,
        Senha: senha,
        TypeUser: typeUser,
        Email: generateEmail(nome),
        id: userInfo.id_EmpresaDb,
        emailPessoal,
        cpf,

        // Info for Logs
        id_EmpresaDb: userInfo.id_EmpresaDb,
        userId: userInfo.id_user,
        userName: userInfo.Nome_user,
      });

      if (response.status === 200) {
        setErro(""); // Clear previous error if success
        onSubmit(); // Close popup
        window.location.reload(); // Reload page to reflect changes
      } else {
        setErro("Erro ao cadastrar funcionário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      setErro("Erro ao cadastrar funcionário. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false); // Hide loading spinner after submission
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
            <InputMask
              mask="999.999.999-99"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCPF(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-mail pessoal do funcionário"
              value={emailPessoal}
              onChange={(e) => setEmailPessoal(e.target.value)}
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
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;