import React, { useState } from 'react';
import "../../../App.css"

const anos = [2023, 2024, 2025]; // Lista de anos disponíveis

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function LogsAdmin() {
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [mesesVisiveis, setMesesVisiveis] = useState(false);

  const handleAnoClick = (ano) => {
    setAnoSelecionado(ano);
    setMesesVisiveis(!mesesVisiveis); // Alterna a visibilidade da lista de meses
  };

  return (
    <div className="ano-mes-selector">
      <div className="anos">
        {anos.map((ano) => (
          <button
            key={ano}
            className="ano-button"
            onClick={() => handleAnoClick(ano)}
          >
            {ano}
          </button>
        ))}
      </div>

      {anoSelecionado && mesesVisiveis && (
        <div className="meses">
          <h3>Meses de {anoSelecionado}</h3>
          <ul>
            {meses.map((mes, index) => (
              <li key={index}>{mes}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LogsAdmin;
