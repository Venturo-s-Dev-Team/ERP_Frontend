import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaFileExport, } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Importação correta
import InputMask from "react-input-mask";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import "./fornecedores.css";

function Fornecedores() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // Modo de edição
  const [showModalFornecedores, setShowModalFornecedores] = useState(false);
  const [selectedFornecedor, setselectedFornecedor] = useState(null); // Fornecedor selecionado
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa


  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setFormData(initialFormData);
  };

  const handleShowFornecedores = () => setShowModalFornecedores(true);
  const handleCloseFornecedores = () => setShowModalFornecedores(false);

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
      const response = await axios.get(`/api/ServerOne/tableFornecedor/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFornecedores(response.data);
      }
    } catch (error) {
      console.log("Não foi possível requerir as informações: ", error);
    }
  };

  // Função de busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFornecedores = fornecedores.filter(
    (fornecedor) =>
      fornecedor.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cpf_cnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dados iniciais do formulário
  const initialFormData = {
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
    ie: "",
    ramo_atividade: "",
    site: "",
    // Adicione mais campos conforme necessário
  };

  const [formData, setFormData] = useState(initialFormData);

  const buscarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        // Atualiza os campos com os valores retornados da API
        setFormData((prevData) => ({
          ...prevData,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
        }));

        console.log(response);
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
      console.log(cep);
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };

  // Função para lidar com mudanças nos inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para submeter o formulário (Adicionar ou Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      try {
        const response = await axios.put(
          `/api/ServerTwo/UpdateFornecedor/${selectedFornecedor.id}`,
          {
            ...formData, id_EmpresaDb: userInfo.id_EmpresaDb,
            userId: userInfo.id_user,
            userName: userInfo.Nome_user,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          // Atualiza a lista de fornecedores após a edição
          fetchDados(userInfo.id_EmpresaDb);
          alert("Fornecedor atualizado com sucesso!");
          handleClose();
        }
      } catch (error) {
        console.error("Erro ao atualizar o fornecedor:", error);
        alert("Não foi possível atualizar o fornecedor.");
      }
    } else {
      try {
        const response = await axios.post(
          "/api/ServerTwo/registerFornecedor",
          {
            ...formData, id_EmpresaDb: userInfo.id_EmpresaDb,
            userId: userInfo.id_user,
            userName: userInfo.Nome_user,
          }, // Enviando o id_EmpresaDb junto aos outros dados
          { withCredentials: true }
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Fornecedor registrado com sucesso!");
          alert("Fornecedor registrado com sucesso!");
          fetchDados(userInfo.id_EmpresaDb); // Atualiza a lista de fornecedores
          handleClose(); // Fecha o modal após o sucesso
        }
      } catch (error) {
        alert("Erro ao registrar Fornecedor");
        console.error("Erro ao registrar o Fornecedor:", error);
      }
    }
  };

  // Função para selecionar um fornecedor e abrir o modal de informações
  const SelecionandoFornecedor = (fornecedor) => {
    setselectedFornecedor(fornecedor);
    handleShowFornecedores(); // Abre o modal de informações do fornecedor
  };

  // Função para abrir o modal de edição com dados pré-preenchidos
  const handleShowEditModal = () => {
    if (!selectedFornecedor) {
      alert("Por favor, selecione um fornecedor para editar.");
      return;
    }
    setIsEditMode(true); // Define o modo de edição
    setFormData({
      id_EmpresaDb: selectedFornecedor.id_EmpresaDb || "",
      cpf_cnpj: selectedFornecedor.cpf_cnpj || "",
      observacoes: selectedFornecedor.observacoes || "",
      razao_social: selectedFornecedor.razao_social || "",
      nome_fantasia: selectedFornecedor.nome_fantasia || "",
      endereco: selectedFornecedor.endereco || "",
      logradouro: selectedFornecedor.logradouro || "",
      bairro: selectedFornecedor.bairro || "",
      cidade: selectedFornecedor.cidade || "",
      cep: selectedFornecedor.cep || "",
      uf: selectedFornecedor.uf || "",
      email: selectedFornecedor.email || "",
      telefone: selectedFornecedor.telefone || "",
      ie: selectedFornecedor.ie || "",
      ramo_atividade: selectedFornecedor.ramo_atividade || "",
      site: selectedFornecedor.site || "",
      // Adicione mais campos conforme necessário
    });
    handleShow(); // Abre o modal
  };




  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3> Fornecedores</h3>
        </div>

        <div className="scroll-despesas">
          <div>
            <div className="Button_Cad">
              <button onClick={handleShow}>
                Adicionar
                <FaPlus />
              </button>
              <button onClick={handleShowEditModal} disabled={!selectedFornecedor}>
                Editar <FaPenToSquare />
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
                placeholder="Pesquisar fornecedores"
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

            <div className="Fornecedores_List">
              <table>
                <caption>Listagem de fornecedores</caption>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ/CPF</th>
                    <th>Informações</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFornecedores.map((Fornecedor) => (
                    <tr key={Fornecedor.id}>
                      <td>{Fornecedor.razao_social}</td>
                      <td>{Fornecedor.cpf_cnpj}</td>
                      <td>
                        <button
                          onClick={() => SelecionandoFornecedor(Fornecedor)}
                          className="Btn-Informations"
                        >
                          {" "}
                          Info.{" "}
                        </button>
                      </td>
                      <td>
                        <input
                          type="radio"
                          name="selectedFornecedor"
                          className="custom-checkbox"
                          onChange={() => setselectedFornecedor(Fornecedor)}
                          checked={selectedFornecedor?.id === Fornecedor.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Adicionar Produto */}

          <Modal
            style={{
              position: "fixed",
              top: "50%",
              bottom: 0,
              left: "50%",
              right: 0,
              zIndex: 1000,
              width: "70%",
              height: "80%",
              borderRadius: 20,
              transform: "translate(-50%, -50%)",
              background: "white",
              boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
              maxHeight: "calc(100% - 20px)", // Ajuste da altura para que a rolagem funcione corretamente
              overflowY: "auto",              // A barra de rolagem será ativada se o conteúdo for maior que a altura
              padding: "10px",
            }}
            show={showModal}
            onHide={handleClose}
          >
            <div className="popup-containerModal">
              <div>
                <h1>Registrar Fornecedor</h1>
              </div>
              <div className="popup-body">
                <form onSubmit={handleSubmit} >
                  <input
                    type="text"
                    name="razao_social"
                    placeholder="Razão Social"
                    value={formData.razao_social}
                    onChange={(e) =>
                      setFormData({ ...formData, razao_social: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    name="nome_fantasia"
                    placeholder="Nome Fantasia"
                    value={formData.nome_fantasia}
                    onChange={(e) =>
                      setFormData({ ...formData, nome_fantasia: e.target.value })
                    }
                    required
                  />

                  <InputMask
                    mask="99.999.999/9999-99"
                    type="text"
                    name="cpf_cnpj"
                    placeholder="CNPJ"
                    value={formData.cpf_cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf_cnpj: e.target.value })
                    }
                    required
                  />

                  <InputMask
                    mask="999.999.999.999"
                    type="text"
                    name="ie"
                    placeholder="IE"
                    value={formData.ie}
                    onChange={(e) =>
                      setFormData({ ...formData, ie: e.target.value })
                    }
                    className="input-inscricao"
                    required
                  />

                  <InputMask
                    mask="99999-999"
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                    onBlur={handleCepBlur}
                    required
                  />

                  <input
                    type="text"
                    name="logradouro"
                    placeholder="Logradouro"
                    value={formData.logradouro}
                    onChange={(e) =>
                      setFormData({ ...formData, logradouro: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) =>
                      setFormData({ ...formData, bairro: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    required
                  />

                  <InputMask
                    mask="aa"
                    type="text"
                    name="uf"
                    placeholder="UF"
                    value={formData.uf}
                    onChange={(e) =>
                      setFormData({ ...formData, uf: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    name="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />

                  <InputMask
                    type="text"
                    name="telefone"
                    placeholder="Telefone"
                    mask="(99)99999-9999"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    required
                  />

                  <InputMask
                    type="text"
                    name="celular"
                    placeholder="Celular"
                    mask="(99)99999-9999"
                    value={formData.celular}
                    onChange={(e) =>
                      setFormData({ ...formData, celular: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    name="site"
                    placeholder="Site"
                    value={formData.site}
                    onChange={(e) =>
                      setFormData({ ...formData, site: e.target.value })
                    }
                  />

                  <input
                    type="text"
                    name="ramo_atividade"
                    placeholder="Ramo de Atividade"
                    value={formData.ramo_atividade}
                    onChange={(e) =>
                      setFormData({ ...formData, ramo_atividade: e.target.value })
                    }
                    required
                  />

                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    className="observacoes2"
                    placeholder="Observações"
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                  />

                  <div className="popup-footer">
                    <button type="submit" >
                      Registrar
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </Modal>




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
            show={showModalFornecedores}
            onHide={handleCloseFornecedores}
          >
            <div className="perfil-cliente">
              <h2>Informações do Cliente</h2>
              <div className="container-infos">
                <div className="info-card">
                  <h3>Dados Básicos</h3>
                  <p>
                    <strong>Nome:</strong> {selectedFornecedor?.razao_social}
                  </p>
                  <p>
                    <strong>CNPJ:</strong> {selectedFornecedor?.cpf_cnpj}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {selectedFornecedor?.telefone}
                  </p>
                  <p>
                    <strong>E-mail:</strong> {selectedFornecedor?.email}
                  </p>
                  <p>
                    <strong>Nome Fantasia:</strong>{" "}
                    {selectedFornecedor?.nome_fantasia}
                  </p>
                </div>

                <div className="info-card">
                  <h3>Endereço</h3>
                  <p>
                    <strong>Logradouro:</strong> {selectedFornecedor?.logradouro}
                  </p>
                  <p>
                    <strong>Bairro:</strong> {selectedFornecedor?.bairro}
                  </p>
                  <p>
                    <strong>Cidade:</strong> {selectedFornecedor?.cidade}
                  </p>
                  <p>
                    <strong>CEP:</strong> {selectedFornecedor?.cep}
                  </p>
                  <p>
                    <strong>UF:</strong> {selectedFornecedor?.uf}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {selectedFornecedor?.endereco}
                  </p>
                </div>

                <div className="info-card">
                  <h3>Informações Adicionais</h3>
                  <p>
                    <strong>Inscrição Estadual:</strong> {selectedFornecedor?.ie}
                  </p>
                  <p>
                    <strong>Ramo de Atividade:</strong>{" "}
                    {selectedFornecedor?.ramo_atividade}
                  </p>
                  <p>
                    <strong>Funcionário:</strong>{" "}
                    {selectedFornecedor?.funcionario}
                  </p>
                  <p>
                    <strong>Site:</strong> {selectedFornecedor?.site}
                  </p>
                  <p>
                    <strong>Observações:</strong>{" "}
                    {selectedFornecedor?.observacoes}
                  </p>
                </div>
              </div>

              <div className="buttons">
                <button onClick={handleCloseFornecedores} className="FecharPr">
                  FECHAR
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Fornecedores;