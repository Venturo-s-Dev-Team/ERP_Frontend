import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  // Animações
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLeft, setIsLeft] = useState(true);
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleToggleClick = () => {
    setIsLeft(!isLeft);
  };

  // Login
  const [nome, setNome] = useState("");
  const [Password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/ServerTwo/login",
        {
          Nome: nome,
          Senha: Password,
        },
        { withCredentials: true }
      );

      if (response.data.TypeUser === "SuperAdmin") {
        navigate("/dashboardAdmin");
      } else if (
        response.data.TypeUser === "Gestor" ||
        "Socio" ||
        "Gerente" ||
        "Financeiro"
      ) {
        navigate("/dashboard");
      } else if (response.data.TypeUser === "Venda") {
        navigate("/vendas");
      } else if (response.data.TypeUser === "Estoque") {
        navigate("/cad_produto");
      } else if (response.data.TypeUser === "Caixa") {
        navigate("/caixa");
      } else {
        alert("Usuário desconhecido");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setProtocoloErro("403");
          setMsgErro("Esta RazaoSocial não está autorizada");
        } else if (error.response.status === 401) {
          setErro("Credenciais inválidas");
        } else {
          setProtocoloErro("500");
          setMsgErro("Ocorreu um erro. Tente novamente mais tarde.");
        }
      } else {
        setProtocoloErro("500");
        setMsgErro("Ocorreu um erro. Tente novamente mais tarde.");
      }
    }
  };

  // Cadastro
  const [Gestor, setGestor] = useState("");
  const [CNPJ, setCNPJ] = useState("");
  const [RazaoSocial, setRazaoSocial] = useState("");
  const [senha, setsenha] = useState("");
  const [Logo, setLogo] = useState(null);

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const generateEmail = (name) => {
    return name.toLowerCase().replace(/\s+/g, ".") + "@venturo.com";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const Email = generateEmail(Gestor);

    const formData = new FormData();
    formData.append("Gestor", Gestor);
    formData.append("Email", Email);
    formData.append("CNPJ", CNPJ);
    formData.append("RazaoSocial", RazaoSocial);
    formData.append("senha", senha);
    formData.append("Logo", Logo);

    try {
      const response = await axios.post("/api/ServerTwo/registro", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/login");
        alert("Cadastro Realizado");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(
          "Estes dados já constam no sistema, insira dados válidos para a validação"
        );
      } else {
        setErro("Não foi possível fazer o registro");
      }
    }
  };

  const handleCNPJChange = (e) => {
    setCNPJ(formatCNPJ(e.target.value));
  };

  return (
    <div className="BodyDiv">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        <div className={`form-container ${isSignUp ? "sign-up" : "sign-in"}`}>
          {isSignUp ? (
            <div className="form-sign-up">
              <h1> Cadastre sua empresa aqui!</h1>
              <form onSubmit={handleRegister}>
                <input
                  value={Gestor}
                  onChange={(e) => setGestor(e.target.value)}
                  type="text"
                  placeholder="Nome"
                  name="Gestor"
                  required
                />
                <input type="text" placeholder="CNPJ" name="CNPJ" required />
                <input
                  value={RazaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  type="text"
                  placeholder="Razão Social"
                  name="RazaoSocial"
                  required
                />
                <input
                  value={senha}
                  onChange={(e) => setsenha(e.target.value)}
                  type="password"
                  placeholder="Senha"
                  name="senha"
                  required
                />
                <input
                  onChange={(e) => setLogo(e.target.files[0])}
                  type="file"
                  placeholder="Logo (opcional)"
                  name="Logo"
                />

                <button className="buttonSignIn" type="submit">
                  Criar
                </button>
              </form>
            </div>
          ) : (
            <div className="form-sign-in">
              <h1 className="titleLogin"> Bem-vindo de volta!</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div>{erro}</div>
                <button className="buttonSignIn" type="submit">
                  Entrar
                </button>
              </form>
            </div>
          )}
        </div>

        <div className={`toggle-container ${isSignUp ? "active" : ""}`}>
          <div className={`toggle ${isSignUp ? "sign-up" : "sign-in"}`}>
            {isSignUp ? (
              <div className="toggle-panel toggle-left">
                <h1>Bem vindo de volta!</h1>
                <p>Entre na sua conta</p>

                <button
                  className="hidden"
                  id="login"
                  onClick={handleSignInClick}
                >
                  Entrar
                </button>
              </div>
            ) : (
              <div className="toggle-panel toggle-right">
                <h1>Bem vindo!</h1>
                <p>Faça seu Registro</p>
                <button
                  className="hidden"
                  id="cadastro"
                  onClick={handleSignUpClick}
                >
                  Cadastro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
