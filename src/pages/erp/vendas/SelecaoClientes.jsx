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
import "./SelecaoClientes.css";


function SelecaoCliente() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [Clientes, setClientes] = useState([]);
  const [showModalClientes, setShowModalClientes] = useState(false);
  const [SelectedCliente, setSelectedCliente] = useState([]);

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

  const handleShowClientes = () => setShowModalClientes(true);
  const handleCloseClientes = () => setShowModalClientes(false);

  const SelecionandoCliente = (cliente) => {
    setSelectedCliente(cliente);
    handleShowClientes();
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

      <div className="Clientes_List">
        <table>
          <caption>Listagem de Clientes</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ/CPF</th>
              <th>Informações</th>
            </tr>
          </thead>
          <tbody>
            {Clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.razao_social}</td>
                <td>{cliente.cpf_cnpj}</td>
                <td>
                  <button
                    onClick={() => SelecionandoCliente(cliente)}
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

export default SelecaoCliente;

