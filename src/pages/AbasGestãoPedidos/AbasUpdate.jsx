import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AbasForUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { VendaForUpdate } = location.state || {};

  const [userInfo, setUserInfo] = useState({});
  const [Clientes, setClientes] = useState([]);
  const [ProductsEstoque, setSelectedEstoque] = useState([]);
  const [registroAtivo, setRegistroAtivo] = useState("clientes");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [lineColors, setLineColors] = useState(["#ccc", "#ccc"]);

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [searchTermProduto, setSearchTermProduto] = useState("");

  const filteredClientes = Clientes.filter(
    (cliente) =>
      cliente.razao_social
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase()) ||
      String(cliente.id).toLowerCase().includes(searchTermCliente.toLowerCase())
  );

  // Renderização das abas
  const renderizarPedidos = () => {
    switch (registroAtivo) {
      case "clientes":
        return (
          <div>
            {/* Input de pesquisa */}
            <div>
              <input
                type="text"
                placeholder="Pesquisar clientes..."
                value={searchTermCliente}
                onChange={handleSearchChangeCliente}
                className="SearchInput"
              />
            </div>
            <div className="Clientes_List">
              <table>
                <caption>Listagem de Clientes</caption>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>CNPJ/CPF</th>
                    <th>Ativo</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.razao_social}</td>
                      <td>{cliente.cpf_cnpj}</td>
                      <td>{cliente.ativo}</td>
                      <td>
                        <input
                          type="radio" // Alterado para radio button
                          name="cliente"
                          className="custom-radio"
                          checked={
                            selectedClient?.razao_social ===
                            cliente.razao_social
                          }
                          onChange={() => handleClientSelect(cliente)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="Div-ButtonProx">
              <button
                onClick={() => setRegistroAtivo("estoque")}
                disabled={!canGoToNextPage()}
                className={`ButtonSendEnv ${
                  canGoToNextPage() ? "" : "disabled"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case "estoque":
        return (
          <div>
            {/* Input de pesquisa de produtos */}
            <div>
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTermProduto}
                onChange={handleSearchChangeProduto}
                className="SearchInput"
              />
            </div>
            <div className="Estoque_List">
              <table id="table-to-export">
                <caption>Listagens de Produtos</caption>
                <thead>
                  <tr>
                    <th>Código do produto</th>
                    <th>Nome</th>
                    <th>Fornecedor</th>
                    <th>Quantidade Disponível</th>
                    <th>Valor Unitário</th>
                    <th>Selecionado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProdutos.map((product) => (
                    <tr key={product.Codigo}>
                      <td>{product.Codigo}</td>
                      <td>{product.Nome}</td>
                      <td>{product.Fornecedor}</td>
                      <td>{product.Quantidade}</td>
                      <td>R$ {product.ValorUnitario}</td>
                      <td>
                        <div className="alinhandoInputsTab">
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={selectedProducts.some(
                              (p) => p.Codigo === product.Codigo
                            )}
                            onChange={() => handleProductSelect(product)}
                          />
                          {selectedProducts.some(
                            (p) => p.Codigo === product.Codigo
                          ) && (
                            <input
                              type="number"
                              min="1"
                              max={Math.min(product.Quantidade)}
                              defaultValue={
                                selectedProducts.find(
                                  (p) => p.Codigo === product.Codigo
                                )?.quantidade || 1
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || /^\d+$/.test(value)) {
                                  const quantity = Math.max(
                                    1,
                                    Math.min(product.Quantidade, Number(value))
                                  ); // Limita a quantidade correta
                                  handleQuantityChange(
                                    product.Codigo,
                                    quantity
                                  );
                                }
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="Div-ButtonProx">
              <button
                onClick={() => setRegistroAtivo("resumo")}
                disabled={!canGoToNextPage()}
                className={`ButtonSendEnv ${
                  canGoToNextPage() ? "" : "disabled"
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        );

      case "resumo":
        return (
          <div className="resumo-container">
            {selectedClient && selectedProducts.length > 0 ? (
              <div className="resumo-content">
                <h4>Cliente Selecionado:</h4>
                <p>
                  Nome: {selectedClient.razao_social} | CNPJ/CPF:{" "}
                  {selectedClient.cpf_cnpj}
                </p>
                <h4>Produtos Selecionados:</h4>
                <ul className="produtos-list">
                  {selectedProducts.map((product) => (
                    <li key={product.Codigo}>
                      {product.Nome} - {product.quantidade} x R${" "}
                      {parseFloat(product.ValorUnitario).toFixed(2)} = R${" "}
                      {(
                        parseFloat(product.ValorUnitario) * product.quantidade
                      ).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <h4>Total: R$ {calcularValorTotal().toFixed(2)}</h4>
                <div className="desconto-container">
                  <label htmlFor="desconto">Desconto:</label>
                  <input
                    id="desconto"
                    placeholder="Desconto"
                    type="number"
                    value={desconto}
                    onChange={(e) =>
                      setDesconto(parseFloat(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                <div className="button-container">
                  <button
                    className="ButtonSendEnv"
                    onClick={() => setRegistroAtivo("estoque")}
                  >
                    Voltar
                  </button>
                  <button className="ButtonSendEnv" onClick={enviarPedido}>
                    Enviar
                  </button>
                </div>
              </div>
            ) : (
              <p>
                Selecione um cliente e pelo menos um produto para ver o resumo.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="main-container">
      <div>
        <h2>Editar Pedido</h2>
        <div className="DivButtonsSequence">
          <div
            className={`buttonSequencia ${
              registroAtivo === "clientes" ? "active" : ""
            }`}
          >
            1
          </div>
          <div
            className="line"
            style={{ backgroundColor: lineColors[0] }}
          ></div>
          <div
            className={`buttonSequencia ${
              registroAtivo === "estoque" ? "active" : ""
            }`}
          >
            2
          </div>
          <div
            className="line"
            style={{ backgroundColor: lineColors[1] }}
          ></div>
          <div
            className={`buttonSequencia ${
              registroAtivo === "resumo" ? "active" : ""
            }`}
          >
            3
          </div>
        </div>
        {renderizarPedidos()}
      </div>
    </main>
  );
};

export default AbasForUpdate;
