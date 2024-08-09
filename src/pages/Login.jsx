import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
        "http://10.144.170.15:3001/login",
        {
          Nome: nome,
          Senha: Password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        alert("Usuário desconhecido");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setProtocoloErro("403");
          setMsgErro("Esta empresa não está autorizada");
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
  const [gestor, setGestor] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [logo, setLogo] = useState(null);

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
    const email = generateEmail(gestor);

    const formData = new FormData();
    formData.append("gestor", gestor);
    formData.append("email", email);
    formData.append("cnpj", cnpj);
    formData.append("empresa", empresa);
    formData.append("senha", senha);
    formData.append("logo", logo);

    try {
      const response = await axios.post(
        "http://10.144.170.15:3001/registro",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/");
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

  const handleCnpjChange = (e) => {
    setCnpj(formatCNPJ(e.target.value));
  };

  return (
    <div className="BodyDiv">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        <div className={`form-container ${isSignUp ? "sign-up" : "sign-in"}`}>
          {isSignUp ? (
            <div className="form-sign-up">
              <h1> Crie sua Conta!</h1>
              <form onSubmit={handleRegister}>
                <input
                  value={gestor}
                  onChange={(e) => setGestor(e.target.value)}
                  type="text"
                  placeholder="Nome"
                  name="gestor"
                  required
                />
                <input
                  value={cnpj}
                  onChange={handleCnpjChange}
                  type="text"
                  placeholder="CNPJ"
                  name="cnpj"
                  required
                />
                <input
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  type="text"
                  placeholder="Nome da empresa"
                  name="empresa"
                  required
                />
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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
