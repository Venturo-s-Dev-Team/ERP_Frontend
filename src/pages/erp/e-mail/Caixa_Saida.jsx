import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './entrada.css';

// Componentes
import EmailPopup from './popup_email';

const Caixa_Saida = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [emails, setEmails] = useState([]);
    const [protocoloErro, setProtocoloErro] = useState(null);
    const [msgErro, setMsgErro] = useState(null);
    const [openedEmailId, setOpenedEmailId] = useState(null);

    // E-mail pop-up
    const [isPopupOpen, setPopupOpen] = useState(false);

    const openPopup = () => setPopupOpen(true);
    const closePopup = () => setPopupOpen(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get('http://192.168.0.177:3001/verifyToken', { withCredentials: true });

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
        verifyToken();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo && userInfo.Email) {
                try {
                    const response = await axios.get('http://192.168.0.177:3001/caixa_saida', {
                        params: { Email: userInfo.Email },
                        withCredentials: true
                    });
                    setEmails(response.data);
                } catch (err) {
                    setProtocoloErro("500");
                    setMsgErro("Não foi possível fazer a requisição da sua caixa de saída");
                }
            }
        };
        fetchData();
    }, [userInfo]);

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

    const toggleEmail = (id) => {
        setOpenedEmailId(openedEmailId === id ? null : id);
    };

    const excluirEmail = async (id) => {
        try {
            await axios.put(`http://192.168.0.177:3001/excluir_email_remetente`, { id });
            setEmails(emails.filter(email => email.id !== id));
        } catch (err) {
            console.error("Erro ao excluir o e-mail", err);
        }
    };

    const Cards = () => (
        <div className="email-list">
            {emails.length > 0 ? (
                emails
                    .sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))
                    .map((email) => (
                        <div key={email.id} className="email-item">
                            <div className="email-header" onClick={() => toggleEmail(email.id)}>
                                {!email.Assunto ? (<h3>Sem assunto para {email.Destinatario}</h3>) : (<h3>{email.Assunto} para {email.Destinatario}</h3>)}
                                <p className="email-timestamp">{formatTimestamp(email.TimeStamp)}</p>
                            </div>
                            {openedEmailId === email.id && (
                                <div className="email-body">
                                    <p>{email.Mensagem}</p>
                                    {email.Arquivo && (
                                        <a href={`http://192.168.0.177:3001/uploads/Docs/${email.Arquivo}`} className="email-attachment">
                                            {email.Arquivo}
                                        </a>
                                    )}
                                    <button className='btn-voltar' onClick={() => excluirEmail(email.id)}>Excluir</button> {/* Botão de exclusão */}
                                </div>
                            )}
                        </div>
                    ))
            ) : (
                <div>Você não enviou nenhuma mensagem.</div>
            )}
        </div>
    );


    return (
        <div className="app">
            <h1 className='Assunto'>E-mail: Suas mensagens enviadas</h1>
            <Cards />
            <button className='btn-voltar' onClick={() => navigate('/E-mail_Caixa_Entrada')}>Caixa de entrada</button>
            <button className='btn-voltar' onClick={openPopup}>Nova Mensagem</button>
            {isPopupOpen && <EmailPopup Email={userInfo?.Email} onClose={closePopup} />}
            <button className='btn-voltar' onClick={() => navigate('/dashboard')}>Voltar</button>
        </div>
    );
};

export default Caixa_Saida;