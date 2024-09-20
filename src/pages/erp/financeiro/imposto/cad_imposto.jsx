import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";



function cad_imposto() {

  const [showModal, setShowModal] = useState(false);
  const [impostos, setImpostos] = useState([{ id: Date.now() }]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const addImposto = () => {
    setImpostos([...impostos, { id: Date.now() }]);
  };

  const removeImposto = (id) => {
    setImpostos(impostos.filter(imposto => imposto.id !== id));
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Cadastrar imposto</h3>
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
            <caption>Impostos Cadastrados</caption>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Alíquota</th>
              </tr>
            </thead>
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
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Cadastrar imposto</h1>
          </div>

          <form>
            <input type="text" placeholder="Estado" />
            <input type="number" placeholder="Alíquota" />
            {impostos.map(imposto => (
              <div key={imposto.id} style={{ marginBottom: '10px' }}>
                <select required className="select-preco-final">
                  <option>Selecione o Imposto</option>
                  <option>Cofins</option>
                  <option>Csll</option>
                  <option>Icms</option>
                  <option>Ipi</option>
                  <option>Irpj</option>
                  <option>Iss</option>
                  <option>Pis</option>
                </select>
                <button type="button" onClick={() => removeImposto(imposto.id)} className="btn-remover-produto">Remover</button>
              </div>
            ))}

            <div className="FooterButton">
              <button className="RegisterPr">Cadastrar</button>
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

export default cad_imposto;
