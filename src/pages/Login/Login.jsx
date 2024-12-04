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

      const userType = response.data.TypeUser;

      if (userType === "SuperAdmin") {
        navigate("/dashboardAdmin");
      } else if (["Gestor", "Socio", "Gerente", "Financeiro"].includes(userType)) {
        navigate("/dashboard");
      } else if (userType === "Venda") {
        navigate("/histVendas");
      } else if (userType === "Estoque") {
        navigate("/cad_produto");
      } else if (userType === "Caixa") {
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

  // Função para formatar o CNPJ
  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  // Função para gerar o e-mail automaticamente
  const generateEmail = (name) => {
    return name.toLowerCase().replace(/\s+/g, ".") + "@venturo.com";
  };

  // Nova função para validar a senha
  const validarSenha = (senha) => {
    if (senha.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }

    // Verificar sequência crescente ou decrescente
    const sequenciaCrescente = /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i;
    const sequenciaDecrescente = /(?:210|321|432|543|654|765|876|987|098|cba|dcb|edc|fed|gfe|hgf|ihg|jih|kji|lkj|mlk|nml|onm|pon|qpo|rqp|srq|tsr|uts|vut|wvu|xwv|yxw|zyx)/i;
    if (sequenciaCrescente.test(senha) || sequenciaDecrescente.test(senha)) {
      return "A senha não pode conter sequências crescentes ou decrescentes.";
    }

    // Verificar repetição de caracteres
    const repeticao = /(.)\1{2,}/;
    if (repeticao.test(senha)) {
      return "A senha não pode conter repetições de caracteres consecutivos.";
    }

    return ""; // Senha válida
  };

  // Cadastro da empresa
  const handleRegister = async (e) => {
    e.preventDefault();

    const Email = generateEmail(Gestor);

    // Validação da senha
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      alert(erroSenha); // Exibe o erro e impede o envio
      return;
    }

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
                <input
                  value={CNPJ}
                  onChange={handleCNPJChange}
                  type="text"
                  placeholder="CNPJ"
                  name="CNPJ"
                  required
                />
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