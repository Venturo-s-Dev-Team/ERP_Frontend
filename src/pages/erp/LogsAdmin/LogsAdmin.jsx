import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "../../../App.css";
import "./LogsAdm.css"

function LogsAdmin() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dataLogs, setDataLogs] = useState([]); // Inicializando como um array vazio
  const [userInfo, setUserInfo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Adicionado para armazenar totalPages
  const logsPerPage = 12;

  const fetchHistoricLogs = async () => {
    try {
      const response = await axios.get('http://10.144.170.27:3002/MainHistoricLogs', {
        params: { page: currentPage, limit: logsPerPage, year: selectedYear, month: selectedMonth },
        withCredentials: true
      });
      if (response.data && Array.isArray(response.data.logs)) {
        setDataLogs(response.data.logs);
        setTotalPages(response.data.totalPages); // Atualiza o totalPages
      } else {
        console.error("Data recebida não é um array:", response.data);
        setDataLogs([]); // Garante que dataLogs seja um array
      }
    } catch (err) {
      console.log(err);
      setDataLogs([]); // Garante que dataLogs seja um array mesmo em caso de erro
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://10.144.170.27:3002/verifyToken', { withCredentials: true });
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
    fetchHistoricLogs(); // Fetch logs when the component mounts
  }, [navigate, currentPage, selectedYear, selectedMonth]);

  // Array com os nomes dos meses
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Extrair anos disponíveis
  const years = [...new Set(dataLogs.map(log => new Date(log.timestamp).getFullYear()))];

  // Extrair meses disponíveis com base no ano selecionado
  const months = selectedYear ? [...new Set(dataLogs
    .filter(log => new Date(log.timestamp).getFullYear() === selectedYear)
    .map(log => new Date(log.timestamp).getMonth() + 1)
  )] : [];

  // Filtrar logs por ano e mês selecionado
  const filteredLogs = dataLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const yearMatch = selectedYear ? logDate.getFullYear() === selectedYear : true;
    const monthMatch = selectedMonth ? (logDate.getMonth() + 1) === selectedMonth : true;
    return yearMatch && monthMatch;
  });

  // Paginação
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="logs-admin">

<div className="titleLogsAdm">
  <h3>
    Logs
    </h3>
  </div>

  <div className="direction-align">

  <div className="buttonsSelector">

<div className="year-selector">
      {years.map(year => (
        <button
          key={year}
          onClick={() => { setSelectedYear(year); setSelectedMonth(null); setCurrentPage(1); }}
          className={year === selectedYear ? 'selected' : ''}
        >
          {year}
        </button>
      ))}
    </div>

    {selectedYear && (
      <div className="month-selector">
        {months.map(month => (
          <button
            key={month}
            onClick={() => { setSelectedMonth(month); setCurrentPage(1); }}
            className={month === selectedMonth ? 'selected' : ''}
          >
            {monthNames[month - 1]}
          </button>
        ))}
      </div>
    )}

  </div>

  

    {selectedMonth && (
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Action</th>
              <th>Table Name</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {dataLogs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user_id}</td>
                <td>{log.user_name}</td>
                <td>{log.action}</td>
                <td>{log.table_name}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    )}
    
    </div>

 
    </div>
  );
}

export default LogsAdmin;