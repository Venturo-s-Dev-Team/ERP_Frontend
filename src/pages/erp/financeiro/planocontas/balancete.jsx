import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import "./balancete.css";

const tabelas = [
  { id: 1,  grupo: "Ativo", descricao: "Venda", conta: 111, saldo: 5656, entrada: 181, saida: 282  },
  { id: 2,  grupo: "Ativo", descricao: "Venda", conta: 111, saldo: 5656, entrada: 181, saida: 282  },
  { id: 3,  grupo: "Ativo", descricao: "Venda", conta: 111, saldo: 5656, entrada: 181, saida: 282  },
  { id: 4,  grupo: "Ativo", descricao: "Venda", conta: 111, saldo: 5656, entrada: 181, saida: 282  },
  { id: 5,  grupo: "Ativo", descricao: "Venda", conta: 111, saldo: 5656, entrada: 181, saida: 282  },

];

function Balancete() {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((json) => {
      const results = json.filter((user) => {
  return (
  value && 
  user &&
  user.name &&
  user.name.toLowerCase().includes(value)
  );
    });
    setResults(results);
  });
  };
  
  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  
  
  const tabelas = [
    { id: 1,  data: "20/09/2027", descricao: "Venda", conta: "A",  grupo: "Ativo", saldo: 111, saida: 111, entrada: 222},
    { id: 2,  data: "20/09/2027", descricao: "Venda", conta: "A",  grupo: "Ativo", saldo: 111, saida: 111, entrada: 222},
    { id: 3,  data: "20/09/2027", descricao: "Venda", conta: "A",  grupo: "Ativo", saldo: 111, saida: 111, entrada: 222},
    { id: 4,  data: "20/09/2027", descricao: "Venda", conta: "A",  grupo: "Ativo", saldo: 111, saida: 111, entrada: 222},
    { id: 5,  data: "20/09/2027", descricao: "Venda", conta: "A",  grupo: "Ativo", saldo: 111, saida: 111, entrada: 222},
  ];
  
  const [results, setResults] = useState([]);
  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Balancete</h3>
      </div>
      
{/* Search Bar começa aqui */}
<div className="search-bar-container">
        <div className="input-wrapper">
<FaSearch id="search-icon"/>
<input placeholder="Digite aqui..."  
className="input-balancete" 
value={input} 
onChange={(e) => handleChange(e.target.value)}/>

        </div>


        <div className="results-list">
          {
            results.map((result, id) => {
              return <div key={id} className="search-result" onClick={(e) => alert(`You clicked on ${result.name}`)} >{result.name}</div>;
            })
            }
        </div>
      </div>

      {/* Search Bar termina */}
      <div className="Balancete_List">
          <table>
            <caption>Relatório Balancete</caption>
            <thead>
              <tr> 
             <th>Grupo</th>
             <th>Descrição</th>
             <th>Conta</th>
             <th>Saldo</th>
             <th>Entrada</th>
             <th>Saída</th>
               
              </tr>
            </thead>
            <tbody>
              {tabelas.map((tabela) => (
                <tr key={tabela.id}>
                  <td>{tabela.grupo}</td>
                  <td>{tabela.descricao}</td>
                  <td>{tabela.conta}</td>
                  <td>{tabela.saldo}</td>
                  <td> {tabela.saida}</td>
                  <td>{tabela.entrada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </main>
  );
}

export default Balancete;
