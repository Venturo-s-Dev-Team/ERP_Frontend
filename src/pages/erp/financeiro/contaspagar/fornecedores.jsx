import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import InputMask from "react-input-mask";

function Fornecedores() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [Fornecedores, setFornecedores] = useState([]);
  const [showModalFornecedores, setShowModalFornecedores] = useState(false);
  const [SelectedFornecedor, setSelectedFornecedor] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
    ie: "",
    ramo_atividade: "",
    site: "",
    observacoes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "/api/ServerTwo/registerFornecedor",
        { ...formData, id_EmpresaDb: userInfo.id_EmpresaDb }, // Enviando o id_EmpresaDb junto aos outros dados
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        console.log("Fornecedor registrado com sucesso!");
        fetchDados(userInfo.id_EmpresaDb); // Atualiza a lista de Fornecedores
        handleClose(); // Fecha o modal após o sucesso
      }
    } catch (error) {
      alert("Erro ao registrar Fornecedor");
      console.error("Erro ao registrar o Fornecedor:", error);
    }
  };
  

  const SelecionandoFornecedor = (Fornecedor) => {
    setSelectedFornecedor(Fornecedor);
    handleShowFornecedores(); // Abre o modal de informações do fornecedor
  };
  

  return (
    <main className="main-container">
      <div className="main-title">
        <h3> Fornecedores</h3>
      </div>

      <div className="Estoque_Cad">
        <div className="Button_Cad">
          <button className="Button-Menu" onClick={handleShow}>
            Adicionar
            <FaPlus />
          </button>
          <button className="Button-Menu">
            Editar
            <FaPenToSquare />
          </button>

          <button className="Button-Menu">
            Exportar
            <FaFileExport />
          </button>
        </div>

        <div className="Estoque_List">
          <table>
            <caption>Listagem de fornecedores</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ/CPF</th>
                <th>Informações</th>
              </tr>
            </thead>
            <tbody>
              {Fornecedores.map((Fornecedor) => (
                <tr key={Fornecedor.id}>
                  <td>{Fornecedor.razao_social}</td>
                  <td>{Fornecedor.cpf_cnpj}</td>
                  <td>
                    <button
                      onClick={() => SelecionandoFornecedor(Fornecedor)}
                      className="ButtonInfoProduct"
                    >
                      {" "}
                      Info{" "}
                    </button>
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
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Registrar Fornecedor</h1>
          </div>
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
              className="input-email"
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
              name="ramo_atividade"
              placeholder="Ramo de Atividade"
              value={formData.ramo_atividade}
              onChange={handleChange}
              required
            />

            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="observacoes2"
              placeholder="Observações"
            />

            <div className="FooterButton">
              <button type="submit" className="RegisterPr">
                Registrar
              </button>
              <button type="button" className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
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
      <p><strong>Nome:</strong> {SelectedFornecedor.razao_social}</p>
      <p><strong>CNPJ:</strong> {SelectedFornecedor.cpf_cnpj}</p>
      <p><strong>Telefone:</strong> {SelectedFornecedor.telefone}</p>
      <p><strong>E-mail:</strong> {SelectedFornecedor.email}</p>
      <p><strong>Nome Fantasia:</strong> {SelectedFornecedor.nome_fantasia}</p>
    </div>

    <div className="info-card">
      <h3>Endereço</h3>
      <p><strong>Logradouro:</strong> {SelectedFornecedor.logradouro}</p>
      <p><strong>Bairro:</strong> {SelectedFornecedor.bairro}</p>
      <p><strong>Cidade:</strong> {SelectedFornecedor.cidade}</p>
      <p><strong>CEP:</strong> {SelectedFornecedor.cep}</p>
      <p><strong>UF:</strong> {SelectedFornecedor.uf}</p>
      <p><strong>Endereço:</strong> {SelectedFornecedor.endereco}</p>
    </div>

    <div className="info-card">
      <h3>Informações Adicionais</h3>
      <p><strong>Inscrição Estadual:</strong> {SelectedFornecedor.ie}</p>
      <p><strong>Ramo de Atividade:</strong> {SelectedFornecedor.ramo_atividade}</p>
      <p><strong>Funcionário:</strong> {SelectedFornecedor.funcionario}</p>
      <p><strong>Site:</strong> {SelectedFornecedor.site}</p>
      <p><strong>Observações:</strong> {SelectedFornecedor.observacoes}</p>
    </div>
  </div>

  <div className="buttons">
    <button onClick={handleCloseFornecedores} className="FecharPr">
      FECHAR
    </button>
  </div>
</div>

        </Modal>

    </main>
  );
}

export default Fornecedores;
