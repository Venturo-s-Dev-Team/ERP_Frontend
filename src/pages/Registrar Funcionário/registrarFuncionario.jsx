import React, { useState, useEffect } from "react";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import SuccessPopup from "./PopupFuncionarios"; // Importe o componente pop-up
import * as XLSX from "xlsx";

function CadastroFuncionario() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [Funcionarios, setFuncionarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  // Função para verificar o token
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
    if (userInfo.id_EmpresaDb) {
      fetchFuncionarios(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

  const fetchFuncionarios = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableFuncionario/${id}`, { withCredentials: true });
      if (response.status === 200) {
        console.log("Dados recebidos do servidor:", response.data.InfoTabela); // Verifique os dados aqui
        const validData = response.data.InfoTabela.filter(
          (funcionario) => funcionario.Nome && funcionario.TypeUser
        );
        setFuncionarios(validData);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
    }
  };
  
  
  // Filtro dos produtos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredFuncionarios = Funcionarios.filter(
    (funcionarios) =>
      (funcionarios.Nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (funcionarios.TypeUser?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );
  

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSuccess = () => {
    closePopup();
  };

  // Função para exportar os dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(Funcionarios); // Converte os dados de funcionários em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Funcionários"); // Adiciona a planilha ao livro

    // Gera o arquivo Excel e inicia o download
    XLSX.writeFile(wb, `Funcionarios_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Cadastrar Funcionário</h3>
        </div>

        <div className="scroll-despesas">
          <div className="Estoque_Cad">
            <div className="Button_Cad">
              <button onClick={openPopup}>
                Cadastrar
                <IoIosPersonAdd />
              </button>

              <button onClick={exportToExcel}>
                Exportar
                <FaFileExport />
              </button>
            </div>
          </div>

          {/* Exibir o pop-up se showPopup for verdadeiro */}
          {showPopup && (
            <SuccessPopup onClose={closePopup} onSubmit={handleSuccess} />
          )}

          {/* Input de pesquisa */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "350px",
            }}
          >
            <BsSearch
              style={{ marginLeft: "10px", color: "#888", fontSize: "18px" }}
            />
            <input
              type="text"
              placeholder="Pesquisar Funcionários ou Setor..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #fff",
                padding: "12px",
                fontSize: "16px",
                width: "300px",
                outline: "none",
                transition: "border-color 0.3s",
                paddingLeft: "10px",
              }}
            />
          </div>

          <div className="Estoque_List">
            <table>
              <caption>Listagem de Funcionários</caption>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>E-mail pessoal</th>
                  <th>Setor</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.Nome}</td>
                    <td>{funcionario.email}</td>
                    <td>{funcionario.emailPessoal}</td>
                    <td>{funcionario.TypeUser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default CadastroFuncionario;
