import React, { useState, useEffect } from "react";
import axios from "axios";
import "./lancontabil.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LanContabil() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [lanContabilData, setLanContabilData] = useState({
    mesAno: "",
    lancamento: "",
    lote: "",
    unidadeNegocio: "",
    data: "",
    documento: "",
    tipoDocumento: "",
    debitoValor: "",      // deve ser "debito_valor"
    debitoTipo: "",       // deve ser "debito_tipo"
    debitoConta: "",      // deve ser "debito_conta"
    creditoValor: "",     // deve ser "credito_valor"
    creditoTipo: "",      // deve ser "credito_tipo"
    creditoConta: "",     // deve ser "credito_conta"
    transacao: "",
    empresa: "",
    valorEmpresa: "",     // deve ser "empresa_valor"
    codigoHistorico: "",  // deve ser "codigo_historico"
    historicoCompleto: "", // deve ser "historico_completo"
  });

  useEffect(() => {
    verifyToken();
  }, []);

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

  // Função para lidar com alterações nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanContabilData({
      ...lanContabilData,
      [name]: value,
    });
  };

  // REGISTRO DO LANÇAMENTO
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Apenas adicionar os campos que não são nulos
    Object.keys(lanContabilData).forEach((key) => {
      if (lanContabilData[key] !== "" && lanContabilData[key] !== null) {
        data.append(key.replace(/([A-Z])/g, "_$1").toLowerCase(), lanContabilData[key]); // Converte camelCase para snake_case
      }
    });

    // Adiciona o ID do usuário para identificação
    data.append("userId", userInfo.id_user);
    data.append("userName", userInfo.Nome_user);

    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

    // Debugging logs
    console.log("userInfo:", userInfo);
    console.log("id:", id);

    try {
      const response = await axios.post(
        `/api/ServerTwo/registroContabil/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Informações enviadas com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário.");
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Lançamento Contabil</h3>
      </div>

      <div className="HeaderModal">
        <h1>Registrar Lançamento Contábil</h1>
      </div>

      <form className="lancontabil-form" onSubmit={handleSubmit}>
        <div className="lancData">
          <h5>Mês/Ano:</h5>
          <input
            type="date"
            name="mesAno"
            value={lanContabilData.mesAno}
            onChange={handleChange}
            required
          />

          <h5>Lançamento:</h5>
          <input
            type="number"
            name="lancamento"
            value={lanContabilData.lancamento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="Movimento">
          <h4>Movimento</h4>
          <div className="LoteMovi">
            <div className="ALINHAR">
              <div className="Lote">
                <h5>Lote:</h5>
                <input
                  type="text"
                  name="lote"
                  value={lanContabilData.lote}
                  onChange={handleChange}
                />
              </div>

              <div className="UniNgc">
                <h5>Unidade de Negócio:</h5>
                <input
                  type="text"
                  name="unidadeNegocio"
                  value={lanContabilData.unidadeNegocio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ALINHAR">
              <div className="Date">
                <h5>Data:</h5>
                <input
                  type="date"
                  name="data"
                  value={lanContabilData.data}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="ALINHAR">
              <div className="Documento">
                <h5>Documento:</h5>
                <input
                  type="text"
                  name="documento"
                  value={lanContabilData.documento}
                  onChange={handleChange}
                />
              </div>

              <div>
                <h5>Tipo de Documento:</h5>
                <input
                  type="text"
                  name="tipoDocumento"
                  value={lanContabilData.tipoDocumento}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Campos de Débito */}
        <div className="Debit">
          <h4>Débito</h4>
          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Valor:</h5>
              <input
                type="number"
                name="debitoValor"
                value={lanContabilData.debitoValor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ALINHAR">
              <h5>Tipo:</h5>
              <select
                name="debitoTipo"
                value={lanContabilData.debitoTipo}
                onChange={handleChange}
              >
                <option value="ativo">ATIVO</option>
                <option value="passivo">PASSIVO</option>
              </select>
            </div>

            <div className="ALINHAR">
              <h5>Conta:</h5>
              <select
                name="debitoConta"
                value={lanContabilData.debitoConta}
                onChange={handleChange}
              >
                <option value="bancos_cta_movimento">
                  BANCOS CTA MOVIMENTO
                </option>
                <option value="outra_conta">OUTRA CONTA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campos de Crédito */}
        <div className="Debit">
          <h4>Crédito</h4>
          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Valor:</h5>
              <input
                type="number"
                name="creditoValor"
                value={lanContabilData.creditoValor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ALINHAR">
              <h5>Tipo:</h5>
              <select
                name="creditoTipo"
                value={lanContabilData.creditoTipo}
                onChange={handleChange}
              >
                <option value="ativo">ATIVO</option>
                <option value="passivo">PASSIVO</option>
              </select>
            </div>

            <div className="ALINHAR">
              <h5>Conta:</h5>
              <select
                name="creditoConta"
                value={lanContabilData.creditoConta}
                onChange={handleChange}
              >
                <option value="bancos_cta_movimento">
                  BANCOS CTA MOVIMENTO
                </option>
                <option value="outra_conta">OUTRA CONTA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restante dos campos */}
        <div className="HistoricoEmp">
          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Empresa:</h5>
              <input
                type="text"
                name="empresa"
                value={lanContabilData.empresa}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Valor Empresa:</h5>
              <input
                type="number"
                name="valorEmpresa"
                value={lanContabilData.valorEmpresa}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Código Histórico:</h5>
              <input
                type="text"
                name="codigoHistorico"
                value={lanContabilData.codigoHistorico}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="DebitMovi">
            <div className="ALINHAR">
              <h5>Histórico Completo:</h5>
              <input
                type="text"
                name="historicoCompleto"
                value={lanContabilData.historicoCompleto}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Registrar Lançamento
        </button>
      </form>
    </main>
  );
}

export default LanContabil;
