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

  // Cadastro
  const [Gestor, setGestor] = useState("");
  const [CNPJ, setCNPJ] = useState("");
  const [RazaoSocial, setRazaoSocial] = useState("");
  const [senha, setsenha] = useState("");
  const [Logo, setLogo] = useState(null);

  return (
    <main className="BodyDiv">
      <div className={`container ${isSignUp ? "active" : ""}`}>
        <div className={`form-container ${isSignUp ? "sign-up" : "sign-in"}`}>
          {isSignUp ? (
            <div className="form-sign-up">
              <h1> Cadastre sua empresa aqui!</h1>
              <form>
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
              <form>
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
    </main>
  );
}

export default Login;
