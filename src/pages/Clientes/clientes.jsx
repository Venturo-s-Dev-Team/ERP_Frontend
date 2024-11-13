import React, { useState, useEffect } from "react";
import {
  FaPenToSquare,
  FaPlus,
  FaTrashCan,
  FaFileExport,
  FaTrash,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BsSearch } from "react-icons/bs";
import { Button, Modal } from "react-bootstrap";
import InputMask from "react-input-mask";
import "./clientes.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Clientes() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [Clientes, setClientes] = useState([]);
  const [showFuncionarioInput, setShowFuncionarioInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalClientes, setShowModalClientes] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Cliente selecionado para edição
  const [isEditMode, setIsEditMode] = useState(false); // Determina se está no modo de edição
  const [formType, setFormType] = useState(""); // Para determinar qual formulário será exibido
  const [SelectedCliente, setSelectedCliente] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setFormType("");
    setIsEditMode(false);
    setFormData({
      id_EmpresaDb: "",
      cpf_cnpj: "",
      observacoes: "",
      razao_social: "",
      nome_fantasia: "",
      endereco: "",
      logradouro: "",
      bairro: "",
      cidade: "",
      cep: "",
      uf: "",
      email: "",
      telefone: "",
      ativo: "NÃO",
      ie: "",
      dia_para_faturamento: "",
      ramo_atividade: "",
      funcionario: [], // Reset para array
      limite: "",
      site: "",
      autorizados: "NÃO",
    });
  };

  const handleShowClientes = () => setShowModalClientes(true);
  const handleCloseClientes = () => setShowModalClientes(false);

  const [formData, setFormData] = useState({
    id_EmpresaDb: "",
    cpf_cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    endereco: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    cep: "",
    uf: "",
    email: "",
    telefone: "",
    ativo: "NÃO",
    ie: "",
    dia_para_faturamento: "",
    ramo_atividade: "",
    funcionario: [""], // Agora um array
    limite: "",
    site: "",
    autorizados: "NÃO", // Inicializando como 'NÃO'
    observacoes: "",
  });

  const handleFormSelection = (type) => {
    setFormType(type); // Define se é CPF ou CNPJ
  };

  const filteredclientes = Clientes.filter(
    (cliente) =>
      cliente.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cliente.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SelecionandoCliente = (cliente) => {
    setSelectedCliente(cliente);
    handleShowClientes();
  };

  const handleEdit = () => {
    setFormData(selectedClient); // Preenche o formulário com os dados do cliente
    setIsEditMode(true); // Define o modo de edição
    setShowModal(true); // Abre o modal
  };

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Clientes</h3>
        </div>
        <div className="scroll-despesas">
          {/* Botões do header */}
          <div className="Button_Cad">
            <button onClick={handleShow}>
              Adicionar
              <FaPlus />
            </button>
            <button onClick={handleEdit} disabled={!selectedClient}>
              Editar
              <FaPenToSquare />
            </button>
            <button>
              Exportar
              <FaFileExport />
            </button>
          </div>

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
              placeholder="Pesquisar clientes"
              value={searchTerm}
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

          <div className="Clientes_List">
            <table>
              <caption>Listagem de Clientes</caption>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>CNPJ/CPF</th>
                  <th>Informações</th>
                  <th>Selecionar</th>
                </tr>
              </thead>
              <tbody>
                {filteredclientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.razao_social}</td>
                    <td>{cliente.cpf_cnpj}</td>
                    <td>
                      <button
                        onClick={() => SelecionandoCliente(cliente)}
                        className="ButtonInfocliente"
                      >
                        {" "}
                        Info{" "}
                      </button>
                    </td>
                    <td>
                      <label className="custom-radio">
                        <input
                          type="radio"
                          name="selectedProduct"
                          value={cliente.id}
                          onChange={() => setSelectedClient(cliente)}
                        />
                        <span className="radio-checkmark"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de seleção do tipo de cliente */}
          <Modal
            style={{
              position: "fixed",
              top: "50%",
              bottom: 0,
              left: "50%",
              right: 0,
              zIndex: 1000,
              width: "70%",
              height: "73%",
              borderRadius: 20,
              transform: "translate(-50%, -50%)",
              background: "white",
              boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
            }}
            show={showModal}
            onHide={handleClose}
          >
            <div className="DivModal1">
              <h1>Selecione o Tipo de Cliente</h1>
              <div>
                <button
                  className="input-selecionar-clientes1"
                  onClick={() => handleFormSelection("CPF")}
                >
                  Pessoa Física (CPF)
                </button>
                <button
                  className="input-selecionar-clientes2"
                  onClick={() => handleFormSelection("CNPJ")}
                >
                  Pessoa Jurídica (CNPJ)
                </button>
                <button onClick={handleClose} className="FecharPr">
                  FECHAR
                </button>
              </div>
            </div>
          </Modal>

          {/* Exibir formulário apenas após a seleção */}
          {formType === "CNPJ" && (
            <Modal
              style={{
                position: "fixed",
                top: "50%",
                bottom: 0,
                left: "55%",
                right: 0,
                zIndex: 1000,
                width: "80%",
                height: "80%",
                borderRadius: 20,
                transform: "translate(-50%, -50%)",
                background: "white",
                boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
              }}
              show={showModal}
              onHide={handleClose}
            >
              <form></form>
              <div className="DivModal2">
                <h1>
                  {isEditMode
                    ? "Editar Cliente (CNPJ)"
                    : "Registrar Cliente (CNPJ)"}
                </h1>
                <form>
                  <input
                    type="text"
                    name="razao_social"
                    placeholder="Razão Social"
                    value={formData.razao_social}
                    required
                  />
                  <input
                    type="text"
                    name="nome_fantasia"
                    placeholder="Nome Fantasia"
                    value={formData.nome_fantasia}
                    required
                  />
                  <InputMask
                    mask="99.999.999/9999-99"
                    type="text"
                    name="cpf_cnpj"
                    placeholder="CNPJ"
                    value={formData.cpf_cnpj}
                    required
                  />
                  <InputMask
                    mask="999.999.999.999"
                    type="text"
                    name="ie"
                    placeholder="IE"
                    value={formData.ie}
                    className="input-inscricao"
                    required
                  />
                  <InputMask
                    mask="99999-999"
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    required
                  />
                  <input
                    type="text"
                    name="logradouro"
                    placeholder="Logradouro"
                    value={formData.logradouro}
                    required
                  />
                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    required
                  />
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    required
                  />
                  <InputMask
                    mask="aa"
                    type="text"
                    name="uf"
                    placeholder="UF"
                    value={formData.uf}
                    required
                  />
                  <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    required
                  />
                  <InputMask
                    type="text"
                    name="telefone"
                    placeholder="Telefone"
                    mask="(99)99999-9999"
                    value={formData.telefone}
                    required
                  />
                  <InputMask
                    type="text"
                    name="celular"
                    placeholder="Celular"
                    mask="(99)99999-9999"
                    value={formData.celular}
                  />
                  <input
                    type="text"
                    name="site"
                    placeholder="Site"
                    value={formData.site}
                  />
                  <input
                    type="text"
                    name="limite"
                    placeholder="Limite de compra (R$)"
                    value={formData.limite}
                    required
                  />
                  <InputMask
                    type="date"
                    name="faturamento"
                    value={formData.dia_para_faturamento}
                  />
                  <input
                    type="text"
                    name="ramo_atividade"
                    placeholder="Ramo de Atividade"
                    value={formData.ramo_atividade}
                    required
                  />
                  <select
                    className="select-clientes"
                    name="ativo"
                    value={formData.ativo}
                  >
                    <option value="SIM">Ativo</option>
                    <option value="NÃO">Inativo</option>
                  </select>
                  <select
                    className="select-clientes2"
                    name="autorizados"
                    value={formData.autorizados}
                  >
                    <option value="NÃO">Não Autorizados</option>
                    <option value="SIM">Autorizados</option>
                  </select>

                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    className="observacoes"
                    placeholder="Observações"
                  />

                  {showFuncionarioInput && (
                    <>
                      {formData.funcionario.map((func, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            placeholder={`Nome do Funcionário ${index + 1}`}
                            value={func}
                            onChange={(e) =>
                              handleAutorizadoChange(index, e.target.value)
                            }
                          />
                          <FaTrash
                            onClick={() => removeAutorizadoInput(index)}
                            style={{ cursor: "pointer", marginLeft: 8 }}
                          />
                          <FaPlus
                            onClick={() => addAutorizadoInput(index)}
                            style={{ cursor: "pointer", marginLeft: 8 }}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  <div>
                    <button type="submit" className="RegisterPr">
                      {isEditMode ? "Salvar Alterações" : "Registrar"}
                    </button>
                    <button
                      type="button"
                      className="FecharPr"
                      onClick={handleClose}
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}

          {formType === "CPF" && (
            <Modal
              style={{
                position: "fixed",
                top: "50%",
                bottom: 0,
                left: "55%",
                right: 0,
                zIndex: 1000,
                width: "80%",
                height: "88%",
                borderRadius: 20,
                transform: "translate(-50%, -50%)",
                background: "white",
                boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
              }}
              show={showModal}
              onHide={handleClose}
            >
              <div className="DivModal1">
                <h1>
                  {isEditMode
                    ? "Editar Cliente (CPF)"
                    : "Registrar Cliente (CPF)"}
                </h1>
                <form>
                  <input
                    type="text"
                    name="razao_social"
                    placeholder="Razão Social"
                    value={formData.razao_social}
                    required
                  />
                  <InputMask
                    mask="999.999.999-99"
                    type="text"
                    name="cpf_cnpj"
                    placeholder="CPF"
                    value={formData.cpf_cnpj}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    required
                  />
                  <InputMask
                    mask="99999-999"
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    required
                  />
                  <input
                    type="text"
                    name="logradouro"
                    placeholder="Logradouro"
                    value={formData.logradouro}
                    required
                  />
                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    required
                  />
                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    required
                  />
                  <InputMask
                    mask="aa"
                    type="text"
                    name="uf"
                    placeholder="UF"
                    value={formData.uf}
                    required
                  />
                  <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    required
                  />
                  <InputMask
                    type="text"
                    name="telefone"
                    placeholder="Telefone"
                    mask="(99)99999-9999"
                    value={formData.telefone}
                    required
                  />
                  <InputMask
                    type="text"
                    name="celular"
                    placeholder="Celular"
                    mask="(99)99999-9999"
                    value={formData.celular}
                  />
                  <input
                    type="text"
                    name="limite"
                    placeholder="Limite"
                    value={formData.limite}
                    required
                  />
                  <InputMask
                    type="date"
                    name="faturamento"
                    value={formData.dia_para_faturamento}
                  />
                  <select
                    className="select-clientes"
                    name="ativo"
                    value={formData.ativo}
                  >
                    <option value="SIM">Ativo</option>
                    <option value="NÃO">Inativo</option>
                  </select>
                  <div>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes}
                      className="observacoes"
                      placeholder="Observações"
                    />
                  </div>

                  <div>
                    <button type="submit" className="RegisterPr">
                      {isEditMode ? "Salvar Alterações" : "Registrar"}
                    </button>
                    <button
                      type="button"
                      className="FecharPr"
                      onClick={handleClose}
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}

          {SelectedCliente && (
            <Modal
              style={{
                position: "fixed",
                top: "50%",
                bottom: 0,
                left: "50%",
                right: 0,
                zIndex: 1000,
                width: "70%",
                height: "73%",
                borderRadius: 20,
                transform: "translate(-50%, -50%)",
                background: "white",
                boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
                padding: 2,
              }}
              show={showModalClientes}
              onHide={handleCloseClientes}
            >
              <div className="perfil-cliente">
                <h2>Informações do Cliente</h2>
                <div className="container-infos">
                  <div className="info-card">
                    <h3>Dados Básicos</h3>
                    <p>
                      <strong>Nome:</strong> {SelectedCliente.razao_social}
                    </p>
                    <p>
                      <strong>CNPJ/CPF:</strong> {SelectedCliente.cpf_cnpj}
                    </p>
                    <p>
                      <strong>Ativo:</strong> {SelectedCliente.ativo}
                    </p>
                    <p>
                      <strong>Telefone:</strong> {SelectedCliente.telefone}
                    </p>
                    <p>
                      <strong>E-mail:</strong> {SelectedCliente.email}
                    </p>
                    <p>
                      <strong>Nome Fantasia:</strong>{" "}
                      {SelectedCliente.nome_fantasia}
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>Endereço</h3>
                    <p>
                      <strong>Logradouro:</strong> {SelectedCliente.logradouro}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {SelectedCliente.bairro}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {SelectedCliente.cidade}
                    </p>
                    <p>
                      <strong>CEP:</strong> {SelectedCliente.cep}
                    </p>
                    <p>
                      <strong>UF:</strong> {SelectedCliente.uf}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {SelectedCliente.endereco}
                    </p>
                  </div>

                  <div className="info-card">
                    <h3>Informações Adicionais</h3>
                    <p>
                      <strong>Inscrição Estadual:</strong> {SelectedCliente.ie}
                    </p>
                    <p>
                      <strong>Dia para Faturamento:</strong>{" "}
                      {SelectedCliente.dia_para_faturamento}
                    </p>
                    <p>
                      <strong>Ramo de Atividade:</strong>{" "}
                      {SelectedCliente.ramo_atividade}
                    </p>
                    <p>
                      <strong>Funcionário:</strong>{" "}
                      {SelectedCliente.funcionario}
                    </p>
                    <p>
                      <strong>Limite:</strong> {SelectedCliente.limite}
                    </p>
                    <p>
                      <strong>Site:</strong> {SelectedCliente.site}
                    </p>
                    <p>
                      <strong>Autorizados:</strong>{" "}
                      {SelectedCliente.autorizados}
                    </p>
                    <p>
                      <strong>Observações:</strong>{" "}
                      {SelectedCliente.observacoes}
                    </p>
                  </div>
                </div>

                <div className="buttons">
                  <button onClick={handleCloseClientes} className="FecharPr">
                    FECHAR
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </main>
    </SideBarPage>
  );
}

export default Clientes;
