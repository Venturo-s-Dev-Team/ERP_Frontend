import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './LogsAdm.css';

function LogsEmpresa() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dataLogs, setDataLogs] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageRange, setPageRange] = useState({ start: 1, end: 5 });
  const [showMonths, setShowMonths] = useState(false);
  const logsPerPage = 10;
  const pagesToShow = 5;

  const fetchHistoricLogs = async (id) => {
    try {
      const response = await axios.get(`/api/ServerTwo/EmpresaHistoricLogs/${id}`, {
        params: { page: currentPage, limit: logsPerPage, year: selectedYear, month: selectedMonth },
        withCredentials: true
      });
      if (response.data && Array.isArray(response.data.logs)) {
        setDataLogs(response.data.logs);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Data recebida não é um array:", response.data);
        setDataLogs([]);
      }
    } catch (err) {
      console.log(err);
      setDataLogs([]);
    }
  };

  useEffect(() => {
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

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchHistoricLogs(userInfo.id_EmpresaDb)
    }
  }, [userInfo.id_EmpresaDb, currentPage, selectedYear, selectedMonth]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = [...new Set(dataLogs.map(log => new Date(log.timestamp).getFullYear()))];

  // Extrair todos os meses únicos para o ano selecionado
  const months = selectedYear ? 
    [...new Set(dataLogs
      .filter(log => new Date(log.timestamp).getFullYear() === selectedYear)
      .map(log => new Date(log.timestamp).getMonth() + 1)
    )] : [];

  const filteredLogs = dataLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    const yearMatch = selectedYear ? logDate.getFullYear() === selectedYear : true;
    const monthMatch = selectedMonth ? (logDate.getMonth() + 1) === selectedMonth : true;
    return yearMatch && monthMatch;
  });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    updatePageRange(pageNumber);
  };

  const updatePageRange = (newPage) => {
    let newStart = newPage - Math.floor(pagesToShow / 2);
    let newEnd = newPage + Math.floor(pagesToShow / 2);

    if (newStart < 1) {
      newStart = 1;
      newEnd = Math.min(pagesToShow, totalPages);
    }
    if (newEnd > totalPages) {
      newEnd = totalPages;
      newStart = Math.max(1, totalPages - pagesToShow + 1);
    }

    setPageRange({ start: newStart, end: newEnd });
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      paginate(newPage);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      paginate(newPage);
    }
  };

  const handleYearClick = (year) => {
    if (year === selectedYear) {
      setSelectedYear(null);
      setSelectedMonth(null);
      setShowMonths(false);
    } else {
      setSelectedYear(year);
      setSelectedMonth(null);
      setCurrentPage(1);
      setShowMonths(true);
    }
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  return (
    <div className="logs-admin">
      <div className="titleLogsAdm">
        <h3>Logs</h3>
      </div>

      <div className="direction-align">
        <div className="buttonsSelector">
          <div className="year-selector">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={year === selectedYear ? 'selected' : ''}
              >
                {year}
              </button>
            ))}
          </div>

          <div className={`month-selector ${showMonths ? 'show' : 'hide'}`}>
            {months.map(month => (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                className={month === selectedMonth ? 'selected' : ''}
              >
                {monthNames[month -1]}
              </button>
            ))}
          </div>
        </div>

        {selectedMonth && (
          <div className="logAdm-table">
            <table>
              <thead>
                <tr>
                  <th>ID do usuário</th>
                  <th>Nome do usuário</th>
                  <th>Ação</th>
                  <th>Data e horário</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>{log.user_id}</td>
                    <td>{log.user_name}</td>
                    <td>{log.action}</td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={handlePrevClick} disabled={currentPage === 1}>
                &laquo;
              </button>
              {Array.from({ length: pageRange.end - pageRange.start + 1 }, (_, i) => pageRange.start + i).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={pageNumber === currentPage ? 'active' : ''}
                >
                  {pageNumber}
                </button>
              ))}
              <button onClick={handleNextClick} disabled={currentPage === totalPages}>
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogsEmpresa;
