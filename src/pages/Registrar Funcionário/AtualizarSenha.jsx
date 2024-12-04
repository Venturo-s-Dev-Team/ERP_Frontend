import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import classNames from "classnames"; // Importando classNames
import "./AtualizarSenha.css";
import { BsSearch } from "react-icons/bs";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const AtualizarSenha = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [novoSenha, setNovoSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [employeeId, setEmployeeId] = useState(null);

  // Função para verificar o token
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

  // Função para buscar o funcionário por nome e CPF (Step 1)
  const handleBuscarFuncionario = async () => {
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    try {
      setErrorMessage(""); // Limpa qualquer erro anterior
      const response = await axios.post(
        `/api/ServerTwo/BuscarFuncionario/${id}`,
        { nome, cpf }
      );

      if (response.data.id) {
        setEmployeeId(response.data.id);
        setStep(2); // Passa para o Step 2 (Alteração de senha)
      } else {
        setErrorMessage("Funcionário não encontrado.");
      }
    } catch (error) {
      console.log("Erro ao buscar funcionário:", error);
      setErrorMessage("Erro ao buscar funcionário.");
    }
  };

  // Função para validar a senha
  const validarSenha = (novoSenha) => {
    if (novoSenha.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }

    // Verificar sequência crescente ou decrescente
    const sequenciaCrescente =
      /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i;
    const sequenciaDecrescente =
      /(?:210|321|432|543|654|765|876|987|098|cba|dcb|edc|fed|gfe|hgf|ihg|jih|kji|lkj|mlk|nml|onm|pon|qpo|rqp|srq|tsr|uts|vut|wvu|xwv|yxw|zyx)/i;
    if (
      sequenciaCrescente.test(novoSenha) ||
      sequenciaDecrescente.test(novoSenha)
    ) {
      return "A senha não pode conter sequências crescentes ou decrescentes de números ou letras, por exemplo: '123 ou 321' ou 'ABC OU CBA'.";
    }

    // Verificar repetição de caracteres
    const repeticao = /(.)\1{2,}/;
    if (repeticao.test(novoSenha)) {
      return "A senha não pode conter repetições de caracteres consecutivos, por exemplo: 'AAA' ou '111'.";
    }

    return ""; // Senha válida
  };

  // Função para enviar a nova senha para o backend (Step 2)
  const handleAtualizarSenha = async () => {
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

    // Validação da senha
    const erroSenha = validarSenha(novoSenha);
    if (erroSenha) {
      alert(erroSenha); // Exibe o erro e impede o envio
      return;
    }

    if (novoSenha !== confirmarSenha) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.put(`/api/ServerTwo/atualizar-senha/${id}`, {
        id_funcionario: employeeId,
        senha: novoSenha,
      });

      if (response.status === 200) {
        setSuccessMessage("Senha atualizada com sucesso!");
        setStep(3); // Passa para o Step 3 (Finalização)
      }
    } catch (error) {
      console.log("Erro ao atualizar senha:", error);
      setErrorMessage("Erro ao atualizar senha.");
    }
  };


  return (
    <SideBarPage>
      <div
        className={classNames("update-password-container", {
          "step-1": step === 1,
          "step-2": step === 2,
          "step-3": step === 3,
        })}
      >
        <header>
          <div className="progress-bar">
            <div
              className={classNames("progress-step", { active: step >= 1 })}
            ></div>
            <div
              className={classNames("progress-step", { active: step >= 2 })}
            ></div>
            <div
              className={classNames("progress-step", { active: step >= 3 })}
            ></div>
          </div>
        </header>

        {step === 1 && (
          <div className="search-form">
            <h2>Buscar Funcionário</h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "350px",
              }}
            >
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #fff",
                  padding: "5px",
                  fontSize: "16px",
                  width: "300px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  paddingLeft: "10px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "350px",
              }}
            >
              <InputMask
                mask="999.999.999-99"
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #fff",
                  padding: "5px",
                  fontSize: "16px",
                  width: "350px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  paddingLeft: "10px",
                }}
              />
            </div>

            <button
              className="BuscarBtn"
              onClick={handleBuscarFuncionario}
            >
              Buscar
            </button>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="password-form">
            <h2>Alterar Senha</h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "350px",
              }}
            >
              <input
                type="password"
                placeholder="Nova Senha"
                value={novoSenha}
                onChange={(e) => setNovoSenha(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #fff",
                  padding: "5px",
                  fontSize: "16px",
                  width: "300px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  paddingLeft: "10px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "350px",
              }}
            >
              <input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #fff",
                  padding: "5px",
                  fontSize: "16px",
                  width: "300px",
                  outline: "none",
                  transition: "border-color 0.3s",
                  paddingLeft: "10px",
                }}
              />
            </div>

            <button
              className="AtualizarBtn"
              onClick={handleAtualizarSenha}
            >
              Atualizar Senha
            </button>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="success-message">
            <p>{successMessage}</p>
            <button
              className="ProsseguirBtn"
              onClick={() => navigate("/funcionarios")}
            >
              Prosseguir
            </button>
          </div>
        )}
      </div>
    </SideBarPage>
  );
};

export default AtualizarSenha;