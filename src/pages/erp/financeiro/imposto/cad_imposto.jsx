import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaFileExport } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./cad_imposto.css";

function CadImposto() {
  const [showModal, setShowModal] = useState(false);
  const [impostos, setImpostos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [impostoData, setImpostoData] = useState({
    uf: "",
    aliquota: "",
    tipo: "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setImpostoData({ uf: "", aliquota: "", tipo: "" }); // Reset data on close
  };
  const navigate = useNavigate();

  // Função para buscar os impostos cadastrados
  const fetchImpostos = async (id) => {
    try {
      const response = await axios.get(`/api/ServerOne/tableImpostos/${id}`, {
        withCredentials: true,
      });
      setImpostos(response.data.InfoTabela);
    } catch (error) {
      console.error("Erro ao buscar Impostos:", error);
      setImpostos([]);
    }
  };

  // Verificar o token
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
          navigate("/login");
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  // Buscar Impostos quando userInfo for definido
  useEffect(() => {
    if (userInfo && userInfo.id_user) {
      const id = userInfo.id_EmpresaDb
        ? userInfo.id_EmpresaDb
        : userInfo.id_user;
      fetchImpostos(id);
    }
  }, [userInfo]);

  // Função para registrar um novo imposto
  const handleRegisterImposto = async (e) => {
    e.preventDefault();
    if (!userInfo) return;
    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
    try {
      await axios.post(
        `/api/ServerTwo/registrarImpostos`,
        {
          uf: impostoData.uf,
          aliquota: impostoData.aliquota,
          tipo: impostoData.tipo,
          id_EmpresaDb: id,
          userId: userInfo.id_user,
          userName: userInfo.Nome_user,
        },
        { withCredentials: true }
      );

      // Após o registro, buscar os impostos atualizados
      await fetchImpostos(id);
      handleClose();
    } catch (error) {
      console.error("Erro ao registrar Imposto:", error);
      alert("Erro ao registrar Imposto.");
    }
  };

  // Atualiza os valores dos inputs no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setImpostoData({ ...impostoData, [name]: value });
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Cadastrar imposto</h3>
      </div>

      <div>
        <div className="Button_Cad">
          <button
            onClick={handleShow}
            disabled={!userInfo}
          >
            Adicionar
            <FaPlus />
          </button>
          <button  disabled={!userInfo}>
            Editar
            <FaPenToSquare />
          </button>
          <button  disabled={!userInfo}>
            Exportar
            <FaFileExport />
          </button>
        </div>

        <div className="Impostos_List">
          <table>
            <caption>Impostos Cadastrados</caption>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Alíquota</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(impostos) && impostos.length > 0 ? (
                impostos.map((imposto) => (
                  <tr key={imposto.id}>
                    <td>{imposto.tipo}</td>
                    <td>{imposto.uf}</td>
                    <td>{imposto.aliquota}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Nenhum imposto cadastrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adicionar Imposto */}
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
        className="add"
        show={showModal}
        onHide={handleClose}
      >
        <div className="DivModal">
          <div>
            <h1>Cadastrar imposto</h1>
          </div>

          <form onSubmit={handleRegisterImposto}>
            <input
              type="text"
              placeholder="Estado"
              name="uf" 
              value={impostoData.uf}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Alíquota"
              name="aliquota"
              value={impostoData.aliquota}
              onChange={handleChange}
              required
            />
            <select
              required
              className="select-preco-final"
              name="tipo" 
              value={impostoData.tipo}
              onChange={handleChange}
            >
              <option value="">Selecione o Imposto</option>
              <option value="Cofins">Cofins</option>
              <option value="Csll">Csll</option>
              <option value="Icms">Icms</option>
              <option value="Ipi">Ipi</option>
              <option value="Irpj">Irpj</option>
              <option value="Iss">Iss</option>
              <option value="Pis">Pis</option>
            </select>

            <div>
              <button type="submit" className="RegisterPr">
                Cadastrar
              </button>
              <button type="button" className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}

export default CadImposto;
