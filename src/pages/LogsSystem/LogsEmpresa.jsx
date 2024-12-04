import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import "./Logs.css";

// Importação dos utilitários de data
import { formatarData, converterDataHora } from "../../utils/dateUtils";

function LogsEmpresa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });
        if (typeof response.data.token === "string") {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error("Token não é uma string:", response.data.token);
          navigate("/");
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) fetchMonths(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedMonth) fetchLogs();
  }, [selectedYear, selectedMonth, currentPage]);

  const fetchYears = async () => {
    try {
      const response = await axios.get(`/api/ServerTwo/EmpresaHistoricLogs`);
      setYears(response.data.years);
    } catch (error) {
      console.error("Erro ao buscar anos:", error);
    }
  };

  const fetchMonths = async (year) => {
    try {
      const response = await axios.get(`/api/ServerTwo/EmpresaHistoricLogs`, {
        params: { year },
      });
      setMonths(response.data.months);
    } catch (error) {
      console.error("Erro ao buscar meses:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/ServerTwo/EmpresaHistoricLogs`, {
        params: { year: selectedYear, month: selectedMonth, page: currentPage },
      });
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    }
  };

  // Função para converter número do mês para nome
  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames[monthNumber - 1] || "Mês Desconhecido";
  };

  return (
    <SideBarPage>
      <div className="logs-admin">
        <div className="titleLogsAdm">
          <h3>Logs</h3>
          <div className="direction-align">
            <div className="buttonsSelector">
              <div className="year-selector">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={year === selectedYear ? "selected" : ""}
                  >
                    {year}
                  </button>
                ))}
              </div>
              {selectedYear && (
                <>
                  <div className={`month-selector ${months ? "show" : "hide"}`}>
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={month === selectedMonth ? "selected" : ""}
                      >
                        {getMonthName(month)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
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
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user_id}</td>
                      <td>{log.user_name}</td>
                      <td>{log.action}</td>
                      <td>{converterDataHora(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideBarPage>
  );
}

export default LogsEmpresa;