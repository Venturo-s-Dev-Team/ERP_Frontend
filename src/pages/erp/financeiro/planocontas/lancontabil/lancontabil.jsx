import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrigi o import do jwtDecode

function LanContabil() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [debitoContas, setDebitoContas] = useState([]); // Contas de débito
  const [creditoContas, setCreditoContas] = useState([]); // Contas de crédito
  const [lanContabilData, setLanContabilData] = useState({
    mesAno: "",
    lancamento: "",
    lote: "",
    unidadeNegocio: "",
    data: "",
    documento: "",
    tipoDocumento: "",
    debitoValor: "",
    debitoTipo: "",
    debitoConta: "",
    creditoValor: "",
    creditoTipo: "",
    creditoConta: "",
    transacao: "",
    empresa: "",
    valorEmpresa: "",
    codigoHistorico: "",
    historicoCompleto: "",
  });

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchContas("Débito", setDebitoContas); // Busca contas de débito
      fetchContas("Crédito", setCreditoContas); // Busca contas de crédito
    }
  }, [userInfo]);

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

  // Função para buscar contas com base na orientação
  const fetchContas = async (orientacao, setContas) => {
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    try {
      const response = await axios.get(
        `/api/ServerOne/tableContas/${id}/${orientacao}`
      );
      setContas(response.data);
    } catch (error) {
      console.error(`Erro ao buscar contas (${orientacao}):`, error);
    }
  };

  // Função que lida com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLanContabilData({
      ...lanContabilData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(lanContabilData).forEach((key) => {
      if (lanContabilData[key] !== "" && lanContabilData[key] !== null) {
        data.append(
          key.replace(/([A-Z])/g, "_$1").toLowerCase(),
          lanContabilData[key]
        );
      }
    });

    data.append("userId", userInfo.id_user);
    data.append("userName", userInfo.Nome_user);

    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

    try {
      const response = await axios.post(
        `/api/ServerTwo/registroContabil/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Informações enviadas com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário.");
    }
  };

  return (
    <main className="main-lanContabil">
      <div className="main-title">
        <h3>Lançamento Contabil</h3>
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
            <h5>Tipo:</h5>
            <select
              name="debitoTipo"
              value={lanContabilData.debitoTipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="ativo">Ativo</option>
              <option value="passivo">Passivo</option>
            </select>
          </div>

          <div className="DebitMovi">
            <h5>Conta:</h5>
            <select
              name="debitoConta"
              value={lanContabilData.debitoConta}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a conta</option>
              {debitoContas.map((conta) => (
                <option key={conta.codigo_reduzido} value={conta.codigo_reduzido}>
                  {conta.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para o valor do débito */}
          <div className="DebitMovi">
            <h5>Valor do Débito:</h5>
            <input
              type="number"
              name="debitoValor"
              value={lanContabilData.debitoValor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Campos de Crédito */}
        <div className="Credito">
          <h4>Crédito</h4>
          <div className="CreditoMovi">
            <h5>Tipo:</h5>
            <select
              name="creditoTipo"
              value={lanContabilData.creditoTipo}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo</option>
              <option value="ativo">Ativo</option>
              <option value="passivo">Passivo</option>
            </select>
          </div>

          <div className="CreditoMovi">
            <h5>Conta:</h5>
            <select
              name="creditoConta"
              value={lanContabilData.creditoConta}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a conta</option>
              {creditoContas.map((conta) => (
                <option key={conta.codigo_reduzido} value={conta.codigo_reduzido}>
                  {conta.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Campo para o valor do crédito */}
          <div className="CreditoMovi">
            <h5>Valor do Crédito:</h5>
            <input
              type="number"
              name="creditoValor"
              value={lanContabilData.creditoValor}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="Empresaa">
          <h4>Empresa</h4>
          <div className="ALINHAR">
            <div>
              <h5>Empresa:</h5>
              <input
                type="text"
                name="empresa"
                value={lanContabilData.empresa}
                onChange={handleChange}
              />
            </div>
            <div>
              <h5>Valor:</h5>
              <input
                type="number"
                name="valorEmpresa"
                value={lanContabilData.valorEmpresa}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="Historico">
          <h5>Histórico:</h5>
          <input
            type="number"
            name="codigoHistorico"
            value={lanContabilData.codigoHistorico}
            onChange={handleChange}
          />
          <textarea
            name="historicoCompleto"
            value={lanContabilData.historicoCompleto}
            onChange={handleChange}
            rows="4"
            placeholder="Digite o histórico completo aqui..."
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">
          Enviar
        </button>
      </form>
    </main>
  );
}

export default LanContabil;
