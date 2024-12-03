// src/utils/dateUtils.js

/**
 * Formata uma data no formato ISO para diferentes representações
 * @param {string} dataISO - Data no formato ISO
 * @param {string} [formato='padrao'] - Formato de saída desejado
 * @returns {string} Data formatada
 */
export const formatarData = (dataISO, formato = 'padrao') => {
    if (!dataISO) return '';
  
    const data = new Date(dataISO);
  
    if (isNaN(data.getTime())) {
      return 'Data inválida';
    }
  
    switch (formato) {
      case 'padrao':
        return data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
  
      case 'completo':
        return data.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
  
      case 'dataHoraCompacto':
        return `${data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        })} ${data.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })}`;
  
      case 'diaMes':
        return data.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long'
        });
  
      case 'dataInput':
        // Formato para input de data (YYYY-MM-DD)
        return data.toISOString().split('T')[0];
  
      default:
        return data.toLocaleDateString('pt-BR');
    }
  };
  
  /**
   * Converte uma data para o formato ISO
   * @param {string} data - Data em qualquer formato
   * @returns {string} Data no formato ISO
   */
  export const converterParaISO = (data) => {
    return new Date(data).toISOString();
  };
  
  /**
   * Calcula a diferença entre duas datas
   * @param {string} dataInicio - Data de início
   * @param {string} dataFim - Data de fim
   * @returns {Object} Objeto com diferenças em dias, horas e minutos
   */
  export const calcularDiferencaDatas = (dataInicio, dataFim) => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
  
    const diferencaMS = fim - inicio;
  
    return {
      dias: Math.floor(diferencaMS / (1000 * 60 * 60 * 24)),
      horas: Math.floor(diferencaMS / (1000 * 60 * 60)),
      minutos: Math.floor(diferencaMS / (1000 * 60))
    };
  };