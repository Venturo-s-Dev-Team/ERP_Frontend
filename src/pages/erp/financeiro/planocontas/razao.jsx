import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import "./razao.css";

function razao() {
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
  { id: 1,  data: "20/09/2027", descricao: "Venda", grupo: "Ativo", saldo: 111  },
  { id: 2,  data: "20/09/2027", descricao: "Venda", grupo: "Ativo", saldo: 111  },
  { id: 3,  data: "20/09/2027", descricao: "Venda", grupo: "Ativo", saldo: 111  },
  { id: 4,  data: "20/09/2027", descricao: "Venda", grupo: "Ativo", saldo: 111  },
];

const [results, setResults] = useState([]);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Razão</h3>
      </div>

{/* Search Bar começa aqui */}
      <div className="search-bar-container">
        <div className="input-wrapper">
<FaSearch id="search-icon"/>
<input placeholder="Digite aqui..."  
className="input-razao" 
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
      <div className="Razao_List">
          <table>
            <caption>Livro Razão</caption>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Grupo</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {tabelas.map((tabela) => (
                <tr key={tabela.id}>
                  <td>{tabela.data}</td>
                  <td>{tabela.descricao}</td>
                  <td>{tabela.grupo}</td>
                  <td> {tabela.saldo}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </main>
  );
}

export default razao;