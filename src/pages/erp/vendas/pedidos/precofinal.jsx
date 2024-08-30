import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

const precos = [
  { id: 1, preco: "Fornecedor 1", custo: 21343, imposto: 3 },
  { id: 2, preco: "Fornecedor 1", custo: 21343, imposto: 3 },
  { id: 3, preco: "Fornecedor 1", custo: 21343, imposto: 3 },
  { id: 4, preco: "Fornecedor 1", custo: 21343, imposto: 3 },
];

function Precofinal() {
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
        <h3>Cálcular Preço Final</h3>
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
            Excluir
            <FaTrashCan />
          </button>
        </div>

        <div className="Estoque_List">
          <table>
            <caption>Preço Final</caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>Preço do Produto</th>
                <th>Custo de Produção</th>
                <th>Imposto</th>
              </tr>
            </thead>
            <tbody>
              {precos.map((preco) => (
                <tr key={preco.id}>
                  <td>{preco.id}</td>
                  <td>{preco.preco}</td>
                  <td>{preco.custo}</td>
                  <td>{preco.imposto}</td>
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
            <h1>Cálcular Preço Final</h1>
          </div>

          <form>
            <input type="number" placeholder="ID" />
            <input type="number" placeholder="Custo do Produto" />
            <input type="number" placeholder="Preço do Produto" />

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

            <button type="button" onClick={addImposto} className="btn-adicionar-produto">Adicionar Imposto</button>

            <div className="FooterButton">
              <button className="RegisterPr">Calcular</button>
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

export default Precofinal;
