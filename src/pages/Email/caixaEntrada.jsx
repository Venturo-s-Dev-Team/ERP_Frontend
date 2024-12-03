import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixaEntradaSaida.css";
import LogoVenturo from "../../images/LogoVenturoBlackV.png";
import { FaPen } from "react-icons/fa";
import { RiInboxUnarchiveFill, RiInboxArchiveFill } from "react-icons/ri";
import SideBarPage from "../../components/Sidebar/SideBarPage";
// Componentes
import EmailPopup from "./popupemail";

const Caixa_Entrada = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [emails, setEmails] = useState([]);
  const [protocoloErro, setProtocoloErro] = useState(null);
  const [msgErro, setMsgErro] = useState('');
  const [openedEmailId, setOpenedEmailId] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [activeButton, setActiveButton] = useState('entrada');

  useEffect(() => {
    verifyToken();
    fetchEmails();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
      if (typeof response.data.token === 'string') {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } else {
        console.error('Token não é uma string:', response.data.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Token inválido', error);
      navigate('/login');
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/ServerOne/caixa_entrada', {
        withCredentials: true
      });
      setEmails(response.data);
    } catch (err) {
      setProtocoloErro("500");
      setMsgErro("Não foi possível fazer a requisição da sua caixa de entrada");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const toggleEmail = async (id) => {
    setOpenedEmailId(openedEmailId === id ? null : id);
    if (openedEmailId !== id) {
      await markEmailAsRead(id);
    }
  };

  const markEmailAsRead = async (id) => {
    try {
      await axios.put('/api/ServerOne/caixa_entrada/view', { id });
      const updatedEmails = emails.map(email =>
        email.id === id ? { ...email, View: 1 } : email
      );
      setEmails(updatedEmails);
    } catch (err) {
      console.error('Erro ao marcar o e-mail como lido', err);
    }
  };

  const renderError = () => (
    <div>Erro {protocoloErro}: {msgErro}</div>
  );

  const excluirEmail = async (id) => {
    try {
      await axios.put(`/api/ServerOne/excluir_email_destinatario`, { id });
      setEmails(emails.filter(email => email.id !== id));
    } catch (err) {
      console.error("Erro ao excluir o e-mail", err);
    }
  };

  const isImage = (fileName) => {
    const validImageExtensions = ["jpeg", "png", "jpg", "webp", "gif"];
    const fileExtension = fileName.split(".").pop().toLowerCase();
    return validImageExtensions.includes(fileExtension);
  };

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
                    <h3>Sem assunto, enviado por {email.Remetente}</h3>
                  ) : (
                    <h3>{email.Assunto}, enviado por {email.Remetente}</h3>
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
    <SideBarPage>
      <div className="scroll-despesas">
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
                className={`btn-caixas ${activeButton === "entrada" ? "active" : ""
                  }`}
                onClick={() => {
                  setActiveButton("entrada");
                  navigate("/email_entrada");
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
                <RiInboxUnarchiveFill style={{ height: 18, width: 18 }} /> Caixa
                de saída
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
        </div></div>
    </SideBarPage>
  );
};

export default Caixa_Entrada;