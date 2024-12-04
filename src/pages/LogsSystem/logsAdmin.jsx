import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SideBarPage from "../../components/Sidebar/SideBarPage";
import './Logs.css';

// Importação dos utilitários de data
import { formatarData, converterDataHora } from "../../utils/dateUtils";

function LogsAdmin() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 12;

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        const decodedToken = jwtDecode(response.data.token);
        if (!decodedToken) throw new Error('Token inválido');
      } catch {
        navigate('/login');
      }
    };

    verifyToken();
    fetchYearsAndMonths();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, selectedYear, selectedMonth]);

  const fetchYearsAndMonths = async () => {
    try {
      const response = await axios.get('/api/ServerTwo/MainHistoricLogs', {
        params: { limit: logsPerPage },
        withCredentials: true,
      });

      setYears(response.data.years);
    } catch (err) {
      console.error('Erro ao buscar anos e meses:', err);
    }
  };

  const fetchMonths = async (year) => {
    try {
      const response = await axios.get('/api/ServerTwo/MainHistoricLogs', {
        params: { year },
        withCredentials: true,
      });

      setMonths(response.data.months);
    } catch (err) {
      console.error('Erro ao buscar meses:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('/api/ServerTwo/MainHistoricLogs', {
        params: {
          page: currentPage,
          limit: logsPerPage,
          year: selectedYear,
          month: selectedMonth,
        },
        withCredentials: true,
      });

      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Erro ao buscar logs:', err);
    }
  };

  const handleYearClick = (year) => {
    setSelectedYear(year === selectedYear ? null : year);
    setSelectedMonth(null);
    setCurrentPage(1);
    if (year !== selectedYear) fetchMonths(year);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  return (
    <SideBarPage>
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
                  className={selectedYear === year ? 'selected' : ''}
                >
                  {year}
                </button>
              ))}
            </div>

            {selectedYear && (
              <div className={`month-selector ${months ? 'show' : 'hide'}`}>
                {months.map(month => (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(month)}
                    className={selectedMonth === month ? 'selected' : ''}
                  >
                    {monthNames[month - 1]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="logAdm-table">
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
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user_id}</td>
                    <td>{log.user_name}</td>
                    <td>{log.action}</td>
                    <td>{log.table_name}</td>
                    <td>{converterDataHora(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              {[...Array(totalPages).keys()].map(page => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={currentPage === page + 1 ? 'active' : ''}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SideBarPage>
  );
}

export default LogsAdmin;