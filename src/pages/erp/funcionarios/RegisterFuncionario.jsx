import React, { useState } from 'react';
import SuccessPopup from './SuccessPopup'; // Importe o componente pop-up
import './RegisterFuncionario.css';

const funcionarios = [
  { id: 1, name: "Funcionario 1",  senha: 2323, },
  { id: 2, name: "Funcionario 2",  senha: 2323, },
  { id: 3, name: "Funcionario 3",  senha: 2323, },
];

function CadastroFuncionario() {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSuccess = () => {
    closePopup();
  };

  return (
    <main className="main-container">

<div className="main-title">
        <h3>Cadastrar Funcionário</h3>
      </div>

      <div className="Estoque_Cad">
        <div className="Button_Cad">
        <button onClick={openPopup}>Cadastrar Funcionário</button>
      
        </div>
        </div>
      {/* Exibir o pop-up se showPopup for verdadeiro */}
      {showPopup && <SuccessPopup onClose={closePopup} onSubmit={handleSuccess} />}


      <div className="Estoque_List">
          <table>
            <caption>Listagem de Funcionários</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Senha</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.name}</td>
                  <td>{funcionario.senha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </main>
  );
}

export default CadastroFuncionario;
