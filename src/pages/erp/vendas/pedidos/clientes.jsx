import React from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import "../../../../App.css";


const clienteslist = [
  { id: 1, name: "Cliente 1", cnpjcpf: 12345678-9, endereco: 3, },
  { id: 2, name: "Cliente 2", cnpjcpf: 12345678-9, endereco: 2, },
  { id: 3, name: "Cliente 3", cnpjcpf: 12345678-9, endereco: 1, },
];

function clientes() {
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Clientes</h3>
      </div>

      {/* Botões do header */}
      <div className="Button_Cad">
          <button className="Button-Menu" >
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
              {clienteslist.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.name}</td>
                  <td>{cliente.cnpjcpf}</td>
                  <td>{cliente.endereco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

    </main>
  );
}

export default clientes;
