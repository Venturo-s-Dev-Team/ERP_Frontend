import React, { useState } from 'react';
import './AtualizarSenha.css';

const AtualizarSenha = () => {
  const [step, setStep] = useState(1); // Controla a etapa atual
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Função para buscar os dados do funcionário
  const handleSearch = () => {
    if (name && cpf) {
      // Simulação de busca: substitua pela lógica de verificação real
      const found = true; // Simula que encontrou os dados do funcionário
      if (found) {
        setStep(2);
      } else {
        setErrorMessage('Funcionário não encontrado');
      }
    }
  };

  // Função para atualizar a senha
  const handleAtualizarSenha = () => {
    if (newPassword === confirmPassword) {
      // Simulação de atualização de senha: substitua pela lógica real de atualização
      setStep(3);
      setSuccessMessage('Senha atualizada com sucesso');
    } else {
      setErrorMessage('As senhas não coincidem');
    }
  };

  // Função para prosseguir para a próxima página
  const handleProceed = () => {
    // Redirecionamento ou ação após a atualização
    console.log('Redirecionando...');
  };

  return (
    <div className="update-password-container">
      <header>
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
        </div>
      </header>

      <div className="form-container">
        {step === 1 && (
          <div className="search-form">
            <h2>Atualizar Senha</h2>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}

        {step === 2 && (
          <div className="password-form">
            <h2>Atualizar Senha</h2>
            <input
              type="password"
              placeholder="Nova Senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleAtualizarSenha}>Atualizar Senha</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="success-message">
            <p>{successMessage}</p>
            <button onClick={handleProceed}>Prosseguir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtualizarSenha;
