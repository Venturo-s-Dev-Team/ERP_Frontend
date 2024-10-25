import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixaEntradaSaida.css";
import { FaPen } from "react-icons/fa";
import { RiInboxUnarchiveFill, RiInboxArchiveFill } from "react-icons/ri";
import LogoVenturo from "../../images/LogoVenturoBlackV.png";
import SideBarPage from "../../components/Sidebar/SideBarPage";

// Componentes
import EmailPopup from "./popupemail";

const Caixa_Saida = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [emails, setEmails] = useState([]);
  const [protocoloErro, setProtocoloErro] = useState(null);
  const [msgErro, setMsgErro] = useState(null);
  const [openedEmailId, setOpenedEmailId] = useState(null);
  const [activeButton, setActiveButton] = useState("saida"); // Estado para o botão ativo
  const [isPopupOpen, setPopupOpen] = useState(false);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  const Cards = () => (
    <div className="email-list">
      {emails.length > 0 ? (
        emails
          .sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))
          .map((email) => (
            <div key={email.id} className="email-item">
              <div
                className="email-header"
                onClick={() => toggleEmail(email.id)}
              >
                {!email.Assunto ? (
                  <h3>Sem assunto para {email.Destinatario}</h3>
                ) : (
                  <h3>
                    {email.Assunto} para {email.Destinatario}
                  </h3>
                )}
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
        <div className="mensagem-sem-envio">
          Você não enviou nenhuma mensagem.
        </div>
      )}
    </div>
  );
  return (
    <SideBarPage>
      <div className="app">
        <div className="titleEmail">
          <h1 className="Assunto">
            E-mail: Suas mensagens enviadas{" "}
            <RiInboxUnarchiveFill
              style={{ height: 35, width: 35, position: "relative", top: 10 }}
            />
          </h1>
          <img src={LogoVenturo} className="LogoEmail" />
        </div>

        <div className="alinhar-divs">
          <div className="buttonsEntrada">
            <button
              className={`btn-mensagem ${isPopupOpen ? "active" : ""}`}
              onClick={openPopup}
            >
              <FaPen style={{ height: 18, width: 18 }} /> Escrever
            </button>

            <button
              className={`btn-caixas ${
                activeButton === "entrada" ? "active" : ""
              }`}
              onClick={() => {
                setActiveButton("entrada");
                navigate("/email_entrada");
              }}
            >
              <RiInboxArchiveFill style={{ height: 18, width: 18 }} /> Caixa de
              Entrada
            </button>

            <button
              className={`btn-caixas ${
                activeButton === "saida" ? "active" : ""
              }`}
              onClick={() => {
                setActiveButton("saida");
                navigate("/E-mail_Caixa_Saida");
              }}
            >
              <RiInboxUnarchiveFill style={{ height: 18, width: 18 }} /> Caixa
              de Saída
            </button>

            {isPopupOpen && (
              <EmailPopup Email={userInfo?.Email} onClose={closePopup} />
            )}
          </div>

          <div className="Conteudo">
            {protocoloErro ? (
              <div>
                Erro {protocoloErro}: {msgErro}
              </div>
            ) : (
              <Cards />
            )}
          </div>
        </div>
      </div>
    </SideBarPage>
  );
};

export default Caixa_Saida;
