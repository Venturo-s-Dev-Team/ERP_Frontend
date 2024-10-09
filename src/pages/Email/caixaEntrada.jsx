import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixaEntradaSaida.css";
import LogoVenturo from "../../images/LogoVenturoBlackV.png";
import { FaPen } from "react-icons/fa";
import { RiInboxUnarchiveFill, RiInboxArchiveFill } from "react-icons/ri";

// Componentes
import EmailPopup from "./popupemail";

const Caixa_Entrada = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [emails, setEmails] = useState([]);
  const [protocoloErro, setProtocoloErro] = useState(null);
  const [msgErro, setMsgErro] = useState("");
  const [openedEmailId, setOpenedEmailId] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("entrada");

  const renderEmails = () => (
    <div className="email-list">
      {emails.length > 0 ? (
        emails
          .sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))
          .map((email) => (
            <div
              key={email.id}
              className={`email-item ${email.View === 0 ? "unread" : ""}`}
            >
              <div
                className="email-header"
                onClick={() => toggleEmail(email.id)}
              >
                <div className="coluna">
                  {email.View === 0 && (
                    <span className="unread-icon">
                      {" "}
                      <div className="dot"></div>
                    </span>
                  )}
                  {!email.Assunto ? (
                    <h3>Sem assunto</h3>
                  ) : (
                    <h3>{email.Assunto}</h3>
                  )}
                </div>

                <p className="email-timestamp">
                  {formatTimestamp(email.TimeStamp)}
                </p>
              </div>
              {openedEmailId === email.id && (
                <div className="email-body">
                  <p>{email.Mensagem}</p>
                  {email.Arquivo && (
                    <a
                      href={`/api/ServerOne/uploads/Docs/${email.Arquivo}`}
                      className="email-attachment"
                    >
                      {email.Arquivo}
                    </a>
                  )}
                  <button
                    className="btn-voltar"
                    onClick={() => excluirEmail(email.id)}
                  >
                    Excluir
                  </button>{" "}
                  {/* Botão de exclusão */}
                </div>
              )}
            </div>
          ))
      ) : (
        <div className="mensagem-sem-envio">Não há mensagens para você</div>
      )}
    </div>
  );

  return (
    <div className="app">
      <div className="titleEmail">
        <div className="TextAssunt">
          <h1 className="Assunto">
            E-mail: Caixa de Entrada{" "}
            <RiInboxArchiveFill
              style={{ height: 35, width: 35, position: "relative", top: 10 }}
            />
          </h1>
        </div>
        <div>
          <img src={LogoVenturo} className="LogoEmail" />
        </div>
      </div>

      <div className="alinhar-divs">
        <div className="buttonsEntrada">
          <button className="btn-mensagem" onClick={() => setPopupOpen(true)}>
            {" "}
            <FaPen style={{ height: 18, width: 18 }} /> Escrever
          </button>

          <button
            className={`btn-caixas ${
              activeButton === "entrada" ? "active" : ""
            }`}
            onClick={() => {
              setActiveButton("entrada");
              navigate("/E-mail_Caixa_Entrada");
            }}
          >
            {" "}
            <RiInboxArchiveFill style={{ height: 18, width: 18 }} /> Caixa de
            Entrada
          </button>

          <button
            className={`btn-caixas ${activeButton === "s" ? "active" : ""}`}
            onClick={() => {
              setActiveButton("entrada");
              navigate("/email_saida");
            }}
          >
            {" "}
            <RiInboxUnarchiveFill style={{ height: 18, width: 18 }} /> Caixa de
            saída
          </button>

          {isPopupOpen && (
            <EmailPopup
              Email={userInfo?.Email}
              onClose={() => setPopupOpen(false)}
            />
          )}
        </div>

        <div className="Conteudo">
          {protocoloErro ? renderError() : renderEmails()}
        </div>
      </div>
    </div>
  );
};

export default Caixa_Entrada;
