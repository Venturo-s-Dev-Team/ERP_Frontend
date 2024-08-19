import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './entrada.css';

// Componentes
import EmailPopup from './popup_email';

const Caixa_Entrada = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const [emails, setEmails] = useState([]);
    const [protocoloErro, setProtocoloErro] = useState(null);
    const [msgErro, setMsgErro] = useState('');
    const [openedEmailId, setOpenedEmailId] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        verifyToken();
    }, []);

    useEffect(() => {
        if (userInfo.Email) {
            fetchEmails(userInfo.Email);
        }
    }, [userInfo]);

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

    const fetchEmails = async (email) => {
        try {
            const response = await axios.get('http://192.168.0.177:3001/caixa_entrada', {
                params: { Email: email },
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
            await axios.put('http://192.168.0.177:3001/caixa_entrada/view', { id });
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
            await axios.put(`http://192.168.0.177:3001/excluir_email_destinatario`, { id });
            setEmails(emails.filter(email => email.id !== id));
        } catch (err) {
            console.error("Erro ao excluir o e-mail", err);
        }
    };

    const renderEmails = () => (
        <div className="email-list">
            {emails.length > 0 ? (
                emails
                    .sort((a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))
                    .map((email) => (
                        <div key={email.id} className={`email-item ${email.View === 0 ? 'unread' : ''}`}>
                            <div className="email-header" onClick={() => toggleEmail(email.id)}>
                                {!email.Assunto ? (<h3>Sem assunto</h3>) : (<h3>{email.Assunto}</h3>)}
                                <p className="email-timestamp">{formatTimestamp(email.TimeStamp)}</p>
                                {email.View === 0 && <span className="unread-icon">🔔</span>}
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
                <div>Não há mensagens para você</div>
            )}
        </div>
    );

    return (
        <div className="app">
            <h1 className='Assunto'>E-mail: Caixa de Entrada</h1>
            {protocoloErro ? renderError() : renderEmails()}
            <button className='btn-voltar' onClick={() => navigate('/E-mail_Caixa_Saida')}>Caixa de saída</button>
            <button className='btn-voltar' onClick={() => setPopupOpen(true)}>Nova Mensagem</button>
            {isPopupOpen && <EmailPopup Email={userInfo?.Email} onClose={() => setPopupOpen(false)} />}
            <button className='btn-voltar' onClick={() => navigate('/dashboard')}>Voltar</button>
        </div>
    );
};

export default Caixa_Entrada;