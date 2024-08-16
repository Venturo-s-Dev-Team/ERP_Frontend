import React, { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import {Modal} from "react-bootstrap";
 

function fluxocaixa() {

  const fluxos = [
    {
      id: 1,
      descricao: "Venda 1",
      entrada: 1.320,
      saida: 4.938,
    },
    {
      id: 2,
      descricao: "Venda 2",
      entrada: 1.324,
      saida: 4.938,
    },
    {
      id: 3,
      descricao: "Venda 3",
      entrada: 1.324,
      saida: 4.938,
    },
    {
      id: 4,
      descricao: "Venda 4",
      entrada: 1.324,
      saida: 4.930,
    },
    {
      id: 5,
      descricao: "Venda 5",
      entrada: 1.300,
      saida: 4.938,
    },
    {
      id: 6,
      descricao: "Venda 6",
      entrada: 1.300,
      saida: 4.938,
    },
    {
      id: 7,
      descricao: "Venda 7",
      entrada: 1.300,
      saida: 4.938,
    },
  ];
  
  
    // Função para abrir modal - add
    const [showModal, setShowModal] = useState(false);
    const abrirModal = () => setShowModal(true);
    const fecharModal = () => setShowModal(false);
    
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Fluxo de Caixa</h3>
      </div>
      
      {/* Botões para cadastrar despesas, excluir ou editar */}
      <div className="Button_Cad">
          <button className="Button-Menu"  onClick={abrirModal}>
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
   {/* Box sobre Saldos */}
   <div className="box_fluxo">
        <div className="saldo1-box">
          <h3>Saldo inicial do dia anterior</h3>
          <h1>R$ 3.499,90</h1>
        </div>
        <div className="saldo2-box">
          <h3>Saldo disponível para o dia seguinte</h3>
          <h1>R$ 4.293,09</h1>
        </div>
      </div>

      
      {/* Div para tabela com o Fluxo */}
      <div className="Despesas_List">
        <table>
          <caption>Fluxo de Caixa - Diário</caption>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Entrada</th>
              <th>Saída</th>
            </tr>
          </thead>
          <tbody>
            {fluxos.map((fluxo) => (
              <tr key={fluxo.id}>
                <td>{fluxo.descricao}</td>
                <td>R$ {fluxo.entrada.toFixed(2)}</td>
                <td>R$ {fluxo.saida.toFixed(2)}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
<div>
  <Modal   style={{
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
          background: "linear-gradient(135deg, #ddd, silver)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={fecharModal}>
          <div>
          <div className="DivModalDesp">
          <div className="HeaderModal">
            <h1>Registrar Fluxo de Caixa</h1>
          </div>
          <form>
            <input type="text" placeholder="Descrição" />
            <input type="number" placeholder="Entrada" />
            <input type="number" placeholder="Saída" />
            <div className="FooterButton">
              <button className="RegisterPr">Registrar</button>
              <button className="FecharPr" onClick={fecharModal}>
                Fechar
              </button>
            </div>
          </form>
        </div>
        
            </div>

    </Modal>
    </div>
    </main>
  );
}

export default fluxocaixa;
