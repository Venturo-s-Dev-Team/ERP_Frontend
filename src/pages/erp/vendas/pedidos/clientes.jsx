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
import { Button, Modal } from "react-bootstrap";
import InputMask from "react-input-mask";
import "./clientes.css";

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

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchDados(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

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

  const fetchDados = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableCliente/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
    }
  };

  // Filtro dos produtos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredclientes = Clientes.filter(
    (cliente) =>
      cliente.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cliente.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    funcionario: [""], // Agora um array
    limite: "",
    site: "",
    autorizados: "NÃO", // Inicializando como 'NÃO'
    observacoes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Lógica para mostrar/esconder o campo de 'funcionário'
    if (name === "autorizados") {
      if (value === "SIM") {
        setShowFuncionarioInput(true);
      } else {
        setShowFuncionarioInput(false);
        setFormData((prevData) => ({
          ...prevData,
          funcionario: [""],
        }));
      }
    }
  };

  const handleAutorizadoChange = (index, value) => {
    const newFuncionarios = [...formData.funcionario];
    newFuncionarios[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      funcionario: newFuncionarios,
    }));
  };

  const addAutorizadoInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      funcionario: [...prevData.funcionario, ""],
    }));
  };

  const removeAutorizadoInput = (index) => {
    const newFuncionarios = formData.funcionario.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      funcionario: newFuncionarios,
    }));
  };

  // Função para buscar o CEP na API ViaCEP
  const buscarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        // Atualiza os campos com os valores retornados da API
        setFormData({
          ...formData,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        });

        console.log(response)
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar o CEP.");
    }
  };

  // Função para lidar com o evento de perder o foco (onBlur) no campo CEP
  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico

    if (cep.length === 8) {
      // Chama a função de busca do CEP se o formato for válido
      buscarCep(cep);
      console.log(cep)
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Concatenando os funcionários em uma string separada por vírgula, apenas se for CNPJ
    const concatenatedFuncionarios = formType === "CNPJ" && Array.isArray(formData.funcionario)
      ? formData.funcionario
          .filter((func) => func.trim() !== "")
          .join(", ")
      : null;
  
    // Tratando campos vazios ou inválidos
    const sanitizedFormData = {
      ...formData,
      ativo: formData.ativo || null,
      autorizados: formData.autorizados.length > 0 ? formData.autorizados : null,
      bairro: formData.bairro || null,
      cep: formData.cep || null,
      cidade: formData.cidade || null,
      dia_para_faturamento: formData.dia_para_faturamento || null,
      email: formData.email || null,
      funcionario: concatenatedFuncionarios, // Pode ser string ou null
      ie: formData.ie || null,
      limite: formData.limite || null,
      logradouro: formData.logradouro || null,
      nome_fantasia: formData.nome_fantasia || null,
      razao_social: formData.razao_social || null,
      ramo_atividade: formData.ramo_atividade || null,
      site: formData.site || null,
      telefone: formData.telefone || null,
      uf: formData.uf || null,
    };
  
    if (isEditMode) {
      // Lógica para editar o cliente
      try {
        const response = await axios.put(
          `/api/ServerTwo/UpdateCliente/${selectedClient.id}`,
          { ...sanitizedFormData, id_EmpresaDb: userInfo.id_EmpresaDb },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          // Atualize a lista de clientes após a edição
          fetchDados(userInfo.id_EmpresaDb);
          alert("Cliente atualizado com sucesso!");
          handleClose();
        }
      } catch (error) {
        console.error("Erro ao atualizar o cliente:", error);
        alert("Não foi possível atualizar o cliente.");
      }
    } else {
      // Lógica para adicionar um novo cliente
      try {
        const response = await axios.post(
          "/api/ServerTwo/registerCliente",
          { ...sanitizedFormData, id_EmpresaDb: userInfo.id_EmpresaDb },
          { withCredentials: true }
        );
        if (response.status === 201 || response.status === 200) { // Verifique se o backend retorna 201 ou 200
          console.log("Cliente registrado com sucesso!");
          alert("Cliente registrado com sucesso!");
          handleClose(); // Fecha o modal após o sucesso
        }
        await fetchDados(userInfo.id_EmpresaDb); // Atualiza a lista de clientes
      } catch (error) {
        alert("Erro ao registrar cliente");
        console.error("Erro ao registrar o cliente:", error);
      }
    }
  };
  

  const handleFormSelection = (type) => {
    setFormType(type); // Define se é CPF ou CNPJ
  };

  const SelecionandoCliente = (cliente) => {
    setSelectedCliente(cliente);
    handleShowClientes();
  };

  const handleEdit = () => {
    if (!selectedClient) {
      alert("Por favor, selecione um cliente para editar.");
      return;
    }
  
    const cpfCnpjDigits = selectedClient.cpf_cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
  
    if (cpfCnpjDigits.length === 11) {
      setFormType("CPF");
    } else if (cpfCnpjDigits.length === 14) {
      setFormType("CNPJ");
    } else {
      alert("CPF/CNPJ inválido.");
      return;
    }
  
    setFormData(selectedClient); // Preenche o formulário com os dados do cliente
    setIsEditMode(true); // Define o modo de edição
    setShowModal(true); // Abre o modal
  };
  

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

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
        <button >
          Exportar
          <FaFileExport />
        </button>
      </div>

      {/* Input de pesquisa */}
      <div>
        <input
          type="text"
          placeholder="Pesquisar clientes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="SearchInput"
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
        <div className="DivModal">
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
      <form onSubmit={handleSubmit}></form>
          <div className="DivModal2">
          <h1>{isEditMode ? "Editar Cliente (CNPJ)" : "Registrar Cliente (CNPJ)"}</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="razao_social"
                placeholder="Razão Social"
                value={formData.razao_social}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="nome_fantasia"
                placeholder="Nome Fantasia"
                value={formData.nome_fantasia}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="99.999.999/9999-99"
                type="text"
                name="cpf_cnpj"
                placeholder="CNPJ"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="999.999.999.999"
                type="text"
                name="ie"
                placeholder="IE"
                value={formData.ie}
                className="input-inscricao"
                onChange={handleChange}
                required
              />
              <InputMask
                mask="99999-999"
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                required
              />
              <input
                type="text"
                name="logradouro"
                placeholder="Logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="aa"
                type="text"
                name="uf"
                placeholder="UF"
                value={formData.uf}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputMask
                type="text"
                name="telefone"
                placeholder="Telefone"
                mask="(99)99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
              <InputMask
                type="text"
                name="celular"
                placeholder="Celular"
                mask="(99)99999-9999"
                value={formData.celular}
                onChange={handleChange}
              />
              <input
                type="text"
                name="site"
                placeholder="Site"
                value={formData.site}
                onChange={handleChange}
              />
              <input
                type="text"
                name="limite"
                placeholder="Limite de compra (R$)"
                value={formData.limite}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="dia_para_faturamento"
                placeholder="Data de faturamento"
                value={formData.dia_para_faturamento}
                onChange={handleChange}
              />
              <input
                type="text"
                name="ramo_atividade"
                placeholder="Ramo de Atividade"
                value={formData.ramo_atividade}
                onChange={handleChange}
                required
              />
              <select
                className="select-clientes"
                name="ativo"
                value={formData.ativo}
                onChange={handleChange}
              >
                <option value="SIM">Ativo</option>
                <option value="NÃO">Inativo</option>
              </select>
              <select
                className="select-clientes2"
                name="autorizados"
                value={formData.autorizados}
                onChange={handleChange}
              >
                <option value="NÃO">Não Autorizados</option>
                <option value="SIM">Autorizados</option>
              </select>

              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
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
                        style={{ cursor: "pointer", marginLeft: 8 }} />
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
          <div className="DivModal">
          <h1>{isEditMode ? "Editar Cliente (CPF)" : "Registrar Cliente (CPF)"}</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="razao_social"
                placeholder="Razão Social"
                value={formData.razao_social}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="999.999.999-99"
                type="text"
                name="cpf_cnpj"
                placeholder="CPF"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="99999-999"
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.cep}
                onChange={handleChange}
                onBlur={handleCepBlur}
                required
              />
              <input
                type="text"
                name="logradouro"
                placeholder="Logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
              <InputMask
                mask="aa"
                type="text"
                name="uf"
                placeholder="UF"
                value={formData.uf}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
              <InputMask
                type="text"
                name="telefone"
                placeholder="Telefone"
                mask="(99)99999-9999"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
              <InputMask
                type="text"
                name="celular"
                placeholder="Celular"
                mask="(99)99999-9999"
                value={formData.celular}
                onChange={handleChange}
              />
              <input
                type="text"
                name="limite"
                placeholder="Limite"
                value={formData.limite}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="dia_para_faturamento"
                placeholder="Data de faturamento"
                value={formData.dia_para_faturamento}
                onChange={handleChange}
              />
              <select
                className="select-clientes"
                name="ativo"
                value={formData.ativo}
                onChange={handleChange}
              >
                <option value="SIM">Ativo</option>
                <option value="NÃO">Inativo</option>
              </select>
              <div>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  className="observacoes"
                  onChange={handleChange}
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
                <p><strong>Nome:</strong> {SelectedCliente.razao_social}</p>
                <p><strong>CNPJ/CPF:</strong> {SelectedCliente.cpf_cnpj}</p>
                <p><strong>Ativo:</strong> {SelectedCliente.ativo}</p>
                <p><strong>Telefone:</strong> {SelectedCliente.telefone}</p>
                <p><strong>E-mail:</strong> {SelectedCliente.email}</p>
                <p><strong>Nome Fantasia:</strong> {SelectedCliente.nome_fantasia}</p>
              </div>

              <div className="info-card">
                <h3>Endereço</h3>
                <p><strong>Logradouro:</strong> {SelectedCliente.logradouro}</p>
                <p><strong>Bairro:</strong> {SelectedCliente.bairro}</p>
                <p><strong>Cidade:</strong> {SelectedCliente.cidade}</p>
                <p><strong>CEP:</strong> {SelectedCliente.cep}</p>
                <p><strong>UF:</strong> {SelectedCliente.uf}</p>
                <p><strong>Endereço:</strong> {SelectedCliente.endereco}</p>
              </div>

              <div className="info-card">
                <h3>Informações Adicionais</h3>
                <p><strong>Inscrição Estadual:</strong> {SelectedCliente.ie}</p>
                <p><strong>Dia para Faturamento:</strong> {SelectedCliente.dia_para_faturamento}</p>
                <p><strong>Ramo de Atividade:</strong> {SelectedCliente.ramo_atividade}</p>
                <p><strong>Funcionário:</strong> {SelectedCliente.funcionario}</p>
                <p><strong>Limite:</strong> {SelectedCliente.limite}</p>
                <p><strong>Site:</strong> {SelectedCliente.site}</p>
                <p><strong>Autorizados:</strong> {SelectedCliente.autorizados}</p>
                <p><strong>Observações:</strong> {SelectedCliente.observacoes}</p>
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
    </main>
  );
}

export default Clientes;
