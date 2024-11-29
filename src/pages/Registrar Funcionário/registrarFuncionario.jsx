import React, { useState, useEffect } from "react";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import axios from "axios";
import InputMask from "react-input-mask";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { BsSearch } from "react-icons/bs";
import SuccessPopup from "./PopupFuncionarios"; // Importe o componente pop-up
import * as XLSX from "xlsx";
import { Modal } from "react-bootstrap";
import { FaPenToSquare } from "react-icons/fa6";

function CadastroFuncionario() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [Funcionarios, setFuncionarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [ShowModalEditFunc, setShowModalEditFunc] = useState(false); //alterar funcionario
  const [selectedFuncionario, setSelectedFuncionario] = useState(null); // Track the selected employee

  const handleModalShowEditFunc = () => setShowModalEditFunc(true);
  const handleModalShowEditFuncClose = () => setShowModalEditFunc(false);

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
      const response = await axios.get(`/api/ServerOne/tableFuncionario/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const validData = response.data.InfoTabela.filter(
          (funcionario) => funcionario.Nome && funcionario.TypeUser
        );
        setFuncionarios(validData);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
    }
  };

  // Filtro dos funcionários
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

  // Função para selecionar o funcionário
  const handleFuncionarioSelect = (funcionario) => {
    setSelectedFuncionario(funcionario);
  };

  // Função para enviar os dados atualizados do funcionário para o backend
  const updateFuncionario = async (e) => {
    e.preventDefault();
    if (!selectedFuncionario) return;

    try {
      const updatedFuncionario = {
        id_funcionario: selectedFuncionario.id,
        Nome: e.target.AlterarNome.value,
        cpf: e.target.alterarCPF.value,
        email: e.target.alterarEMAIL.value,
        emailPessoal: e.target.alterarEMAILpessoal.value,
        TypeUser: e.target.alterarCargo.value,
      };

      const response = await axios.put(
        `/api/ServerTwo/updateFuncionario/${userInfo.id_EmpresaDb}`,
        updatedFuncionario,
        { withCredentials: true }
      );

      if (response.status === 200) {
        fetchFuncionarios(userInfo.id_EmpresaDb); // Re-fetch employee data after update
        handleModalShowEditFuncClose(); // Close the modal
      }
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
    }
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

              <button
                className="Button_Cad"
                onClick={handleModalShowEditFunc}
                disabled={!selectedFuncionario} // Disable if no employee is selected
              >
                Editar
                <FaPenToSquare />
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
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuncionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.Nome}</td>
                    <td>{funcionario.email}</td>
                    <td>{funcionario.emailPessoal}</td>
                    <td>{funcionario.TypeUser}</td>
                    <td>
                      <label className="custom-radio">
                        <input
                          type="radio"
                          name="selectedFuncionario"
                          checked={selectedFuncionario?.id === funcionario.id}
                          onChange={() => handleFuncionarioSelect(funcionario)} // Set the selected employee
                        />
                        <span className="radio-checkmark"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Edit */}
      <Modal
        show={ShowModalEditFunc}
        onHide={handleModalShowEditFuncClose}
        style={{
          position: "fixed",
          top: "50%",
          bottom: 0,
          left: "50%",
          right: 0,
          zIndex: 1000,
          width: "70%",
          height: "73%",
          padding: 20,
          borderRadius: 20,
          transform: "translate(-50%, -50%)",
          background: "white",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
          padding: 2,
        }}
      >
        <div className="popup-containerModal">
          <div className="HeaderModal">
            <h1>Editar Funcionário</h1>
          </div>
          <div className="popup-body">
            <form onSubmit={updateFuncionario}>
              <input
                type="text"
                name="AlterarNome"
                defaultValue={selectedFuncionario?.Nome}
                placeholder="Alterar Nome"
              />
              <InputMask
                mask="999.999.999-99"
                name="alterarCPF"
                defaultValue={selectedFuncionario?.cpf}
                placeholder="Alterar CPF"
              />
              <input
                type="email"
                name="alterarEMAIL"
                defaultValue={selectedFuncionario?.email}
                placeholder="Alterar e-mail"
              />
              <input
                type="email"
                name="alterarEMAILpessoal"
                defaultValue={selectedFuncionario?.emailPessoal}
                placeholder="Alterar e-mail pessoal"
              />
              <select name="alterarCargo" defaultValue={selectedFuncionario?.TypeUser}>
                <option value="">Selecione para mudar o cargo</option>
                <option value="Socio">Sócio</option>
                <option value="Gerente">Gerente</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Estoque">Estoque</option>
                <option value="Venda">Venda</option>
                <option value="Caixa">Caixa</option>
              </select>
              <div className="popup-footer">
                <button className="button_Cad">CONCLUIR</button>
                <button className="button_Cad" onClick={handleModalShowEditFuncClose}>
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </SideBarPage>
  );
}

export default CadastroFuncionario;