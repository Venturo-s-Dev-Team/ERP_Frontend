import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lanc_contabil.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

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

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Lançamento Contabil</h3>
        </div>

        <div className="scroll-despesas">
          <form className="lancontabil-form">
            <div className="lancData">
              <div className="divsLancData">
                <h5>Mês/Ano:</h5>
                <input
                  type="date"
                  name="mesAno"
                  value={lanContabilData.mesAno}
                  required
                />
              </div>
              <div className="divsLancData">
                <h5>Lançamento:</h5>
                <input
                  type="number"
                  name="lancamento"
                  value={lanContabilData.lancamento}
                  required
                />
              </div>
            </div>

            <div className="Movimento">
              <h4>Movimento</h4>
              <div className="LoteMovi">
                <div className="Lote">
                  <h5>Lote:</h5>
                  <input type="text" name="lote" value={lanContabilData.lote} />

                  <div className="UniNgc">
                    <h5>Unidade de Negócio:</h5>
                    <input
                      type="text"
                      name="unidadeNegocio"
                      value={lanContabilData.unidadeNegocio}
                    />
                  </div>
                </div>

                <div className="Date">
                  <h5>Data:</h5>
                  <input
                    type="date"
                    name="data"
                    value={lanContabilData.data}
                    required
                  />
                </div>

                <div className="Documento">
                  <h5>Documento:</h5>
                  <input
                    type="text"
                    name="documento"
                    value={lanContabilData.documento}
                  />

                  <div>
                    <h5>Tipo de Documento:</h5>
                    <input
                      type="text"
                      name="tipoDocumento"
                      value={lanContabilData.tipoDocumento}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* campo de débito*/}
            <div className="Debit">
              <h4>Débito</h4>
              <div className="DebitAlign">
                <div className="DebitMovi">
                  <h5>Tipo:</h5>
                  <select
                    name="debitoTipo"
                    value={lanContabilData.debitoTipo}
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
                    required
                  >
                    <option value="">Selecione a conta</option>
                    {debitoContas.map((conta) => (
                      <option
                        key={conta.codigo_reduzido}
                        value={conta.codigo_reduzido}
                      >
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
                    required
                    placeholder="R$"
                  />
                </div>
              </div>
            </div>
            {/* Campos de Crédito */}
            <div className="Credito">
              <h4>Crédito</h4>
              <div className="CreditoAlign">
                <div className="CreditoMovi">
                  <h5>Tipo:</h5>
                  <select
                    name="creditoTipo"
                    value={lanContabilData.creditoTipo}
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
                    required
                  >
                    <option value="">Selecione a conta</option>
                    {creditoContas.map((conta) => (
                      <option
                        key={conta.codigo_reduzido}
                        value={conta.codigo_reduzido}
                      >
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
                    required
                  />
                </div>
              </div>
            </div>
            <div className="Empresa">
              <h4>Empresa</h4>
              <div className="EmpresaAlign">
                <div className="EmpresaMovi">
                  <h5>Empresa:</h5>
                  <input
                    type="text"
                    name="empresa"
                    value={lanContabilData.empresa}
                  />
                </div>
                <div className="EmpresaMovi">
                  <h5>Valor:</h5>
                  <input
                    type="number"
                    name="valorEmpresa"
                    value={lanContabilData.valorEmpresa}
                  />
                </div>
              </div>
            </div>
            <div className="Historico">
              <h4>Histórico:</h4>
              <div className="HistoricoAlign">
                <div className="HistoricMovi">
                  <h5>Código Histórico</h5>
                  <input
                    type="number"
                    name="codigoHistorico"
                    value={lanContabilData.codigoHistorico}
                  />
                </div>
                <div className="HistoricMovi">
                  <textarea
                    name="historicoCompleto"
                    value={lanContabilData.historicoCompleto}
                    rows="4"
                    placeholder="Digite o histórico completo aqui..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <button type="submit" className="ButtonLanContabil">
              Enviar
            </button>
          </form>
        </div>
      </main>
    </SideBarPage>
  );
}

export default LanContabil;