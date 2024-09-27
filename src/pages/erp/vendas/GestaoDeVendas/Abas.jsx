import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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

  const handleClientSelect = (cliente) => {
    const isSelected = selectedClient && selectedClient.id === cliente.id;
    setSelectedClient(isSelected ? null : cliente);
    
    setLineColors([
      isSelected ? "#ccc" : "#0a5483",
      lineColors[1]
    ]);
  };

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some((p) => p.Codigo === product.Codigo);
    setSelectedProducts((prev) =>
      isSelected ? prev.filter((p) => p.Codigo !== product.Codigo) : [...prev, product]
    );

    setLineColors([
      lineColors[0],
      isSelected ? "#ccc" : "#0a5483"
    ]);
  };

  const canGoToNextPage = () => {
    if (registroAtivo === "clientes") {
      return selectedClient !== null;
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

      // Função para calcular o valor total dos produtos
  const calcularValorTotal = () => {
    const total = selectedProducts.reduce((acc, product) => acc + parseFloat(product.ValorUnitario), 0);
    return total-(total*(desconto/100));
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
      if (response.status === 200) {
        alert("Venda registrada com sucesso!");
        // Resetar estados ou redirecionar após o sucesso
      } else {
        console.error("Erro ao registrar venda: ", response.data);
      }
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
            <div className="Clientes_List">
              <table>
                <caption>Listagem de Clientes</caption>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CNPJ/CPF</th>
                    <th>Status</th>
                    <th>Selecionar</th>
                  </tr>
                </thead>
                <tbody>
                  {Clientes.map((cliente) => (
                    <tr key={cliente.id}>
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
                className={`ButtonSendEnv ${canGoToNextPage() ? '' : 'disabled'}`}
              >
                Próximo
              </button>
            </div>
          </div>
        );
      case "estoque":
        return (
          <div>
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
                  {ProductsEstoque.map((product) => (
                    <tr key={product.Codigo}>
                      <td>{product.Codigo}</td>
                      <td>{product.Nome}</td>
                      <td>{product.Fornecedor}</td>
                      <td>{product.Quantidade}</td>
                      <td>R$ {product.ValorUnitario}</td>
                      <td>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          checked={selectedProducts.some((p) => p.Codigo === product.Codigo)}
                          onChange={() => handleProductSelect(product)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="Div-ButtonProxEstoque">
              <button className="ButtonSendEnv" onClick={() => setRegistroAtivo("clientes")}>
                Voltar
              </button>
              <button 
                onClick={() => setRegistroAtivo("Resumo")}
                disabled={!canGoToNextPage()}
                className={`ButtonSendEnv ${canGoToNextPage() ? '' : 'disabled'}`}
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
                  Nome: {selectedClient.razao_social} | CNPJ/CPF: {selectedClient.cpf_cnpj}
                </p>
                <h4>Produtos Selecionados:</h4>
                <ul className="produtos-list">
                  {selectedProducts.map((product) => (
                    <li key={product.Codigo}>
                      Nome: {product.Nome} | Valor Unitário: R$ {product.ValorUnitario}
                    </li>
                  ))}
                </ul>
                <h4>Valor total:</h4>
                <p>R$ {calcularValorTotal().toFixed(2)}</p>
                <div className="desconto-container">
                  <label htmlFor="desconto">Desconto:</label>
                  <input
                    id="desconto"
                    placeholder="Desconto"
                    type="number"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    required
                  />
                </div>
                <div className="button-container">
                <button className="ButtonSendEnv" onClick={() => setRegistroAtivo("estoque")}>Voltar</button>
                <button className="ButtonSendEnv" onClick={enviarPedido}>Enviar</button>
                </div>
              </div>
            ) : (
              <p>Selecione um cliente e pelo menos um produto para ver o resumo.</p>
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
        <h2>Adicionar Pedidos</h2>
        <div className="DivButtonsSequence">
          <div
            className={`buttonSequencia ${selectedClient ? 'active' : ''}`}

          >
            1
          </div>
          <div className="line" style={{ backgroundColor: lineColors[0] }}></div>
          <div
            className={`buttonSequencia ${selectedProducts.length > 0 ? 'active' : ''}`}
      
          >
            2
          </div>
          <div className="line" style={{ backgroundColor: lineColors[1] }}></div>
          <div
            className={`buttonSequencia ${selectedClient && selectedProducts.length > 0 ? 'active' : ''}`}
          
          >
            3
          </div>
        </div>
        {renderizarPedidos()}
      </div>
    </main>
  );
}

export default Abas;
