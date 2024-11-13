import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import "./razao.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Razao() {
  const [input, setInput] = useState("");

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const tabelas = [
    {
      id: 1,
      data: "20/09/2027",
      descricao: "Venda",
      grupo: "Ativo",
      saldo: 111,
    },
    {
      id: 2,
      data: "20/09/2027",
      descricao: "Venda",
      grupo: "Ativo",
      saldo: 111,
    },
    {
      id: 3,
      data: "20/09/2027",
      descricao: "Venda",
      grupo: "Ativo",
      saldo: 111,
    },
    {
      id: 4,
      data: "20/09/2027",
      descricao: "Venda",
      grupo: "Ativo",
      saldo: 111,
    },
  ];

  const [results, setResults] = useState([]);

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Razão</h3>
        </div>

        <div className="scroll-despesas">
          {/* Search Bar começa aqui */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "350px",
            }}
          >
            <BsSearch
              style={{ marginLeft: "10px", color: "#888", fontSize: "18px" }}
            />
            <input
              placeholder="Digite aqui..."
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid #fff",
                padding: "12px",
                fontSize: "16px",
                width: "300px",
                outline: "none",
                transition: "border-color 0.3s",
                paddingLeft: "10px",
              }}
            />
          </div>

          <div className="results-list">
            {results.map((result, id) => {
              return (
                <div
                  key={id}
                  className="search-result"
                  onClick={(e) => alert(`You clicked on ${result.name}`)}
                >
                  {result.name}
                </div>
              );
            })}
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
    </SideBarPage>
  );
}

export default Razao;
