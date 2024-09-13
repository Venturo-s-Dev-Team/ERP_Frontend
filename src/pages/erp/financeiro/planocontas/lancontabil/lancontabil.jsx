import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import "./lancontabil.css";

function LanContabil() {

  return (
    <main className="main-container">
      <div className="main-title">
        <h3> Lançamento Contabil</h3>
      </div>

      <div className="HeaderModal">
        <h1>Registrar Lançamento Contabil</h1>
      </div>

      <form className="lancontabil-form">
      <div className="lancData">
          <h5>Mês/Ano:</h5>
          <input type="date" />

          <h5>Lançamento:</h5>
          <input type="number" />
        </div>

        <div className="Movimento">
          <h4>Movimento</h4>
          <div className="LoteMovi">
            <div className="ALINHAR">
              <div className="Lote">
                <h5>Lote:</h5>
                <input type="text" />
              </div>

              <div className="UniNgc">
                <h5>Unidade de Negócio:</h5>
                <input type="text" />
              </div>
            </div>

            <div className="ALINHAR">
              <div className="Date">
                <h5>Data:</h5>
                <input type="date" />
              </div>
            </div>

            <div className="ALINHAR">
              <div className="Documento">
                <h5>Documento</h5>
                <input type="text" />

                <h5>Tipo de Documento</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="Debit">
          <h4>Débito</h4>
          <div className="DebitMovi">
          <div className="ALINHAR">
  <h5>Valor:</h5>
  <input type="number" />
</div>

<div className="ALINHAR">
  <h5>TIPO:</h5>
  <select>
    <option value="ativo">ATIVO</option>
    <option value="passivo">PASSIVO</option>
  </select>
</div>

<div className="ALINHAR">
  <h5>Conta:</h5>
  <select>
    <option value="bancos_cta_movimento">BANCOS CTA MOVIMENTO</option>
    <option value="outra_conta">OUTRA CONTA</option>
  </select>
</div>

</div>


        </div>

        <div className="Debit">
          <h4>Crédito</h4>
          <div className="DebitMovi">
          <div className="ALINHAR">
  <h5>Valor:</h5>
  <input type="number" />
</div>

<div className="ALINHAR">
  <h5>Tipo:</h5>
  <select>
    <option value="ativo">ATIVO</option>
    <option value="passivo">PASSIVO</option>
  </select>
</div>

<div className="ALINHAR">
  <h5>Conta:</h5>
  <select>
    <option value="bancos_cta_movimento">BANCOS CTA MOVIMENTO</option>
    <option value="outra_conta">OUTRA CONTA</option>
  </select>
</div>

</div>


        </div>

        <div className="Transacao">
          <h4>Transação</h4>
          <div className="DebitMovi">
            <div className="ALINHAR">
              <div className="Debito">
                <input type="number" />
              </div>
            </div>
          </div>
        </div>

        <div className="HistoricoEmp">
          <div className="DebitMovi">
            <div className="ALINHAR">
              <div className="Empresa">
                <h5>Empresa</h5>
              </div>
            </div>
          </div>

          <div className="DebitMovi">
            <div className="ALINHAR">
              <div className="Empresa">
                <h5>Valor:</h5>

                <input type="number" />
                <h5>Código Histórico:</h5>

                <input type="number" />
              </div>
            </div>
          </div>

          <div className="DebitMovi">
            <div className="ALINHAR">
              <div className="Empresa">
                <h5>Histórico Completo:</h5>

                <input type="text" />
              </div>
            </div>
          </div>
        </div>

        <div>
            <button className="ButtonLanContabil">
                Enviar
                </button>
            </div>
      </form>
    </main>
  );
}

export default LanContabil;
