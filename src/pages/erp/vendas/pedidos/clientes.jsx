import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan, FaFileExport, FaTrash } from "react-icons/fa6";
import "../../../../App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, Modal } from "react-bootstrap";
import InputMask from 'react-input-mask';

function Clientes() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [Clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id_EmpresaDb: '',
    razao_social: '',
    nome_fantasia: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    cep: '',
    uf: '',
    email: '',
    telefone: '',
    ativo: '',
    ie: '',
    dia_para_faturamento: '',
    ramo_atividade: '',
    funcionario: '',
    limite: '',
    site: '',
    autorizados: '',
  });
  const [showFuncionarioInput, setShowFuncionarioInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("");  // Para determinar qual formulário será exibido

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_user) {
      fetchDados(userInfo.id_user);
    }
  }, [userInfo]);

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

  const fetchDados = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableCliente/${id}`, { withCredentials: true });
      if (response.status === 200) {
        setClientes(response.data);
      }
    } catch (error) {
      console.log('Não foi possível requerir as informações: ', error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData,[e.target.name]: e.target.value });

    if (name === "funcionario" && value === "SIM") {
      setShowFuncionarioInput(true);
    } else if (name === "funcionario" && value === "NÃO") {
      setShowFuncionarioInput(false);
      setFormData({ ...formData, autorizados: [""] });
    }
  };

  const handleAutorizadoChange = (index, value) => {
    const newAutorizados = [...formData.autorizados];
    newAutorizados[index] = value;
    setFormData({ ...formData, autorizados: newAutorizados });
  };

  const addAutorizadoInput = () => {
    setFormData({ ...formData, autorizados: [...formData.autorizados, ""] });
  };

  const removeAutorizadoInput = (index) => {
    const newAutorizados = formData.autorizados.filter((_, i) => i !== index);
    setFormData({ ...formData, autorizados: newAutorizados });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/ServerTwo/registerCliente', {formData, id_EmpresaDb: userInfo.id_EmpresaDb}, { withCredentials: true });
      if (response.status === 200) {
        console.log("Cliente registrado com sucesso!");
        fetchDados(userInfo.id_user);  // Atualiza a lista de clientes
        handleClose();  // Fecha o modal após o sucesso
      }
    } catch (error) {
      console.error("Erro ao registrar o cliente:", error);
    }
  };

  const handleFormSelection = (type) => {
    setFormType(type); // Define se é CPF ou CNPJ
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

      {/* Botões do header */}
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
          Excluir
          <FaTrashCan />
        </button>
        <button className="Button-Menu">
          Exportar
          <FaFileExport />
        </button>
      </div>

      <div className="Clientes_List">
        <table>
          <caption>Listagem de Clientes</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ/CPF</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {Clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.razao_social}</td>
                <td>{cliente.cnpj}</td>
                <td>{cliente.endereco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de seleção do tipo de cliente */}
      <Modal style={{
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
        onHide={handleClose}>
        <div className="DivModalCont">
          <h1>Selecione o Tipo de Cliente</h1>
          <div className="select-form-type">
            <button onClick={() => handleFormSelection("CPF")}>Pessoa Física (CPF)</button>
            <button onClick={() => handleFormSelection("CNPJ")}>Pessoa Jurídica (CNPJ)</button>
          </div>
        </div>
      </Modal>

      {/* Exibir formulário apenas após a seleção */}
      {formType === "CNPJ" && (
        <Modal style={{
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
        onHide={handleClose}>
          <div className="DivModalCont">
            <h1>Registrar Cliente (CNPJ)</h1>
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
                  className='input-inscricao'
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
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={formData.bairro}
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
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              value={formData.celular}
              onChange={handleChange}
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
            mask="99999-999"
              type="text"
              name="cep"
              placeholder="CEP"
              value={formData.cep}
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
              name="limite"
              placeholder="Limite"
              value={formData.limite}
              onChange={handleChange}
              required
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
            <select name="ativo" value={formData.ativo} onChange={handleChange}>
              <option value="SIM">Ativo</option>
              <option value="NÃO">Inativo</option>
            </select>
            <select name="funcionario" value={formData.funcionario} onChange={handleChange}>
              <option value="NÃO">Não Autorizado</option>
              <option value="SIM">Autorizado</option>
            </select>

            {showFuncionarioInput && (
              <>
                {formData.autorizados.map((autorizado, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder={`Nome do Funcionário ${index + 1}`}
                      value={autorizado}
                      onChange={(e) => handleAutorizadoChange(index, e.target.value)}
                    />
                    <FaTrash onClick={() => removeAutorizadoInput(index)} style={{ cursor: "pointer", marginLeft: 8 }} />
                  </div>
                ))}
                <button type="button" className="add-button" onClick={addAutorizadoInput}>
                  Adicionar Funcionário <FaPlus />
                </button>
              </>
            )}

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
      )}

      {formType === "CPF" && (
        <Modal style={{
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
        onHide={handleClose}>
          <div className="DivModalCont">
            <h1>Registrar Cliente (CPF)</h1>
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
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={formData.endereco}
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
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="telefone"
              placeholder="Telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              value={formData.celular}
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
            mask="99999-999"
              type="text"
              name="cep"
              placeholder="CEP"
              value={formData.cep}
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
              name="limite"
              placeholder="Limite"
              value={formData.limite}
              onChange={handleChange}
              required
            />
            <select name="ativo" value={formData.ativo} onChange={handleChange}>
              <option value="SIM">Ativo</option>
              <option value="NÃO">Inativo</option>
            </select>
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
      )}

    </main>
  );
}

export default Clientes;