import React, { useState } from "react";
import SuccessPopup from "./PopupFuncionarios"; // Importe o componente pop-up
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import * as XLSX from "xlsx";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function CadastroFuncionario() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [Funcionarios, setFuncionarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  // Filtro dos produtos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredFuncionarios = Funcionarios.filter(
    (funcionarios) =>
      funcionarios.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionarios.TypeUser.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div>
          <input
            type="text"
            placeholder="Pesquisar Funcionários ou Setor..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="SearchInput"
          />
        </div>

        <div className="Estoque_List">
          <table>
            <caption>Listagem de Funcionários</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Setor</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.Nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.TypeUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SideBarPage>
  );
}

export default CadastroFuncionario;
