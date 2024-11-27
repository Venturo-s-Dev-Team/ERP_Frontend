import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsSearch } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import SideBarPage from "../../components/Sidebar/SideBarPage";
import "./Abas.css";

function Abas() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  // TOKEN
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get("/api/ServerTwo/verifyToken", {
        withCredentials: true,
      });
      if (typeof response.data.token === "string") {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } else {
        console.error("Token não é uma string:", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Token inválido", error);
      navigate("/login");
    }
  };

  // FETCH DE DADOS
  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchDadosClientes(userInfo.id_EmpresaDb);
      fetchDadosEstoque(userInfo.id_EmpresaDb)
    }
  }, [userInfo]);

  const [registroAtivo, setRegistroAtivo] = useState("clientes");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [lineColors, setLineColors] = useState(["#ccc", "#ccc"]);

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some((p) => p.Codigo === product.Codigo);
    if (isSelected) {
      // Remove o produto da seleção
      setSelectedProducts((prev) => prev.filter((p) => p.Codigo !== product.Codigo));
    } else {
      // Adiciona o produto à seleção com quantidade 1
      setSelectedProducts((prev) => [...prev, { ...product, quantidade: 1 }]);
    }

    setLineColors([
      lineColors[0],
      isSelected ? "#ccc" : "#0a5483"
    ]);
  };

  const handleQuantityChange = (codigo, quantidade) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.Codigo === codigo ? { ...product, quantidade: parseInt(quantidade) } : product
      )
    );
  };

  const handleClientSelect = (cliente) => {
    // Permite selecionar ou desmarcar o cliente, mas sem alertas
    const isSelected = selectedClient && selectedClient.id === cliente.id;
    setSelectedClient(isSelected ? null : cliente);
  
    setLineColors([
      isSelected ? "#ccc" : "#0a5483",
      lineColors[1]
    ]);
  };
  
  const canGoToNextPage = () => {
    if (registroAtivo === "clientes") {
      // Verifica se o cliente está selecionado e se é ativo
      return selectedClient !== null && selectedClient.ativo === "SIM";
    }
    if (registroAtivo === "estoque") {
      return selectedProducts.length > 0;
    }
    return false;
  };  
  


    // INFORMAÇÕES DOS CLIENTES

    const [Clientes, setClientes] = useState([]);

    const fetchDadosClientes = async (id) => {
      try {
        const response = await axios.get(`/api/ServerOne/tableCliente/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setClientes(response.data);
        }
      } catch (error) {
        console.log("Não foi possível requerir as informações: ", error);
      }
    };


    // INFORMAÇÕES DOS PRODUTOS

    const [ProductsEstoque, setSelectedEstoque] = useState([]);

    const fetchDadosEstoque = async (id) => {
      try {
        const response = await axios.get(`/api/ServerOne/tableEstoque/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setSelectedEstoque(response.data.InfoTabela);
        }
      } catch (error) {
        console.log("Não foi possível requerir as informações: ", error);
      }
    };

    // OUTRAS FUNÇÕES

    // Filtro
    const [searchTermCliente, setSearchTermCliente] = useState(""); // Estado para armazenar o termo de pesquisa
    const [searchTermProduto, setSearchTermProduto] = useState(""); // Estado para armazenar o termo de pesquisa

        // Filtro dos clientes e produtos
        const handleSearchChangeCliente = (e) => {
          setSearchTermCliente(e.target.value); // Atualiza o termo de pesquisa
        };
      
        const filteredClientes = Clientes.filter(
          (cliente) =>
            cliente.razao_social.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
            String(cliente.id).toLowerCase().includes(searchTermCliente.toLowerCase())
        );

        const handleSearchChangeProduto = (e) => {
          setSearchTermProduto(e.target.value); // Atualiza o termo de pesquisa
        };
      
        const filteredProdutos = ProductsEstoque.filter(
          (product) =>
            product.Nome.toLowerCase().includes(searchTermProduto.toLowerCase()) ||
            String(product.Codigo).toLowerCase().includes(searchTermProduto.toLowerCase())
        );

      // Função para calcular o valor total dos produtos
      const calcularValorTotal = () => {
        const total = selectedProducts.reduce((acc, product) => acc + (parseFloat(product.ValorUnitario) * product.quantidade), 0);
        return total - (total * (desconto / 100));
      };
    
  

  const enviarPedido = async () => {
    if (!selectedClient || selectedProducts.length === 0) {
      alert("Selecione um cliente e pelo menos um produto.");
      return;
    }
  
    const dadosVenda = {
      nome_cliente: selectedClient.razao_social,    // Cliente selecionado
      produto: JSON.stringify(selectedProducts),    // Produtos em formato JSON
      desconto: desconto,                           // Desconto aplicado
      total: calcularValorTotal().toFixed(2),                 // Valor total, formatado com 2 casas decimais
      vendedor: userInfo.Nome_user                  // Nome do vendedor que está logado
    };

    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;
  
    try {
      const response = await axios.post(`/api/ServerTwo/registrarPedido/${id}`, dadosVenda, {
        withCredentials: true,
      });
        alert("Pedido registrado com sucesso!");
        navigate("/gestaoVendas")
    } catch (error) {
      console.error("Erro ao enviar os dados da venda: ", error);
      alert("Erro ao registrar a venda.");
    }
  };

  const renderizarPedidos = () => {
    switch (registroAtivo) {
      case "clientes":
        return (
          <div>
            {/* Input de pesquisa */}
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
              type="text"
              placeholder="Pesquisar clientes"
              onChange={handleSearchChangeCliente}
              value={searchTermCliente}
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
                          type="checkbox"
                          className="custom-checkbox"
                          checked={selectedClient && selectedClient.id === cliente.id}
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
            {/* Input de pesquisa */}
            <div>
              <input
                type="text"
                placeholder="Pesquisar clientes..."
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
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Selecionar</th>
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
                              defaultValue={1}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Permite apenas números ou deixa em branco
                                if (value === "" || /^\d+$/.test(value)) {
                                  const quantity = Math.max(
                                    1,
                                    Math.min(
                                      Math.min(product.Quantidade),
                                      Number(value)
                                    )
                                  ); // Limita entre 1 e o menor valor entre 10 e product.Quantidade
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

            <div className="Div-ButtonProxEstoque">
              <button
                className="ButtonSendEnv"
                onClick={() => setRegistroAtivo("clientes")}
              >
                Voltar
              </button>
              <button
                onClick={() => setRegistroAtivo("Resumo")}
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
      case "Resumo":
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
                      {product.ValorUnitario} = R${" "}
                      {(product.ValorUnitario * product.quantidade).toFixed(2)}
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
                    min={0} // Define o valor mínimo como 0
                    max={5} // Define o valor máximo como 5
                    onChange={(e) => {
                      const valor = parseFloat(e.target.value);
                      if (valor >= 0 && valor <= 5) {
                        setDesconto(valor); // Atualiza com o valor dentro do intervalo permitido
                      } else if (valor < 0) {
                        setDesconto(0); // Corrige automaticamente para o valor mínimo
                      } else {
                        setDesconto(5); // Corrige automaticamente para o valor máximo
                      }
                    }}
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
    <SideBarPage>
    <main className="main-container">
      <div>
        <h2>Adicionar Pedidos</h2>
        <div className="DivButtonsSequence">
          <div className={`buttonSequencia ${selectedClient ? "active" : ""}`}>
            1
          </div>
          <div
            className="line"
            style={{ backgroundColor: lineColors[0] }}
          ></div>
          <div
            className={`buttonSequencia ${
              selectedProducts.length > 0 ? "active" : ""
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
              selectedClient && selectedProducts.length > 0 ? "active" : ""
            }`}
          >
            3
          </div>
        </div>
        {renderizarPedidos()}
      </div>
    </main>
    </SideBarPage>
  );
}

export default Abas;
