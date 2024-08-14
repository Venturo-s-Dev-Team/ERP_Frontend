import React from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";

const receitas = [
  {
    id: 1,
    nome: "Venda 1",
    valor: 1.320,
    
  },
  {
    id: 2,
    nome: "Venda 2",
    valor: 1.320,
  },
  {
    id: 3,
    nome: "Venda 3",
    valor: 1.320,
  },
  {
    id: 4,
    nome: "Venda 4",
    valor: 1.320,
  },
];

function Receitas() {
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Receitas</h3>
      </div>
        {/* Botões para cadastrar despesas, excluir ou editar */}
        <div className="Button_Cad">
          <button className="Button-Menu">
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
      {/* Div para tabela com a receita */}
      <div className="Despesas_List">
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
                <td>{receita.nome}</td>
                <td>R$ {receita.valor.toFixed(2)}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Receitas;
