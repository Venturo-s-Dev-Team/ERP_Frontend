import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import "./receitas.css";

function Receitas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReceita, setNewReceita] = useState({
    Nome: "",
    Valor: "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Função para exportar dados para Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(receitas); // Converte os dados de receitas em uma planilha
    const wb = XLSX.utils.book_new(); // Cria um novo livro de trabalho
    XLSX.utils.book_append_sheet(wb, ws, "Receitas"); // Adiciona a planilha ao livro

    // Gera o arquivo Excel e inicia o download
    XLSX.writeFile(wb, `Receitas_${new Date().toLocaleDateString()}.xlsx`);
  };

  // Função para calcular o total de receitas
  const totalReceitas = receitas.reduce(
    (acc, receita) => acc + Number(receita.Valor),
    0
  );

  return (
    <main>
      <div>
        <h3>Receitas</h3>
      </div>

      <div className="Button_Cad">
        <button onClick={handleShow}>
          Adicionar
          <FaPlus />
        </button>
        <button>
          Editar
          <FaPenToSquare />
        </button>

        <button onClick={exportToExcel}>
          Exportar
          <FaFileExport />
        </button>
      </div>

      <div className="box_receitas">
        <div className="total-box">
          <h3>Total de receitas acumuladas</h3>
          <h1>R$ {totalReceitas.toFixed(2)}</h1>
        </div>
      </div>

      <div className="Receitas_List">
        <table>
          <caption>Registro de Receita</caption>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor por mês</th>
            </tr>
          </thead>
          <tbody>
            {receitas.map((receita) => (
              <tr key={receita.id}>
                <td>{receita.Nome}</td>
                <td>R$ {Number(receita.Valor).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <div className="DivModalReceitas">
          <div>
            <h1>Registrar Receita</h1>
          </div>

          <form>
            <input
              type="text"
              name="Nome"
              placeholder="Nome"
              value={newReceita.Nome}
              required
            />
            <input
              type="number"
              name="Valor"
              placeholder="Valor por Mês"
              value={newReceita.Valor}
              required
            />
            <div>
              <button className="RegisterPr" type="submit">
                Registrar
              </button>
              <button className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}

export default Receitas;
