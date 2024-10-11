import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import "./cad_produto.css";
import VenturoImg from "../../../images/ChatBotAssist.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx"; // Adiciona a importação da biblioteca xlsx

function RegistroProduto() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ProductsEstoque, setSelectedEstoque] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [RegisterProdutos, setRegisterProdutos] = useState({
    Nome: "",
    Quantidade: "",
    ValorUnitario: "",
    Fornecedor: "",
    Tamanho: "",
    Imagem: null,
    Estoque: "0",
    autorizados: [], // Inicializando como array
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleShowInfo = (product) => {
    setSelectedProduct(product);
    setShowModalInfo(true);
  };

  const handleCloseInfo = () => {
    window.location.reload(); // Recarrega a página
  };

  const handleShowEdit = (product) => {
    setSelectedProduct(product);
    setRegisterProdutos({
      Nome: product.Nome,
      Quantidade: product.Quantidade,
      ValorUnitario: product.ValorUnitario,
      Fornecedor: product.Fornecedor,
      Tamanho: product.Tamanho,
      Imagem: null,
      Estoque: "0",
      autorizados: [], // Adicionar se necessário
    });
    setShowModalEdit(true);
  };

  const handleCloseEdit = () => setShowModalEdit(false);

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_EmpresaDb) {
      fetchDados(userInfo.id_EmpresaDb);
    }
  }, [userInfo]);

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

  const fetchDados = async (id) => {
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

  // Filtro dos produtos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  const filteredProducts = ProductsEstoque.filter(
    (product) =>
      product.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.Codigo).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "ValorUnitario" ? parseFloat(value).toFixed(2) : value;
    setRegisterProdutos({ ...RegisterProdutos, [name]: formattedValue });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setRegisterProdutos({ ...RegisterProdutos, [name]: e.target.files[0] });
  };

  // UPDATE DO PRODUTO
  const updateProdutoAPI = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Adiciona todos os campos do produto ao FormData
    Object.entries(RegisterProdutos).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    // Inclui o ID do banco de dados (ou usuário)
    const id = selectedProduct.Codigo;
    const database_id = userInfo.id_EmpresaDb
      ? userInfo.id_EmpresaDb
      : userInfo.id_user;

    // Adiciona o database_id ao FormData
    data.append("database_id", database_id);

    try {
      // Faz a requisição PUT para atualizar o produto
      await axios.put(`/api/ServerOne/updateProduct/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Produto atualizado com sucesso!");
      handleCloseEdit();
      fetchDados(userInfo.id_EmpresaDb);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto.");
    }
  };

  // REGISTRO DO PRODUTO
  const Registro_Produto = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Apenas adicionar os campos que não são nulos
    Object.keys(RegisterProdutos).forEach((key) => {
      if (RegisterProdutos[key] !== "" && RegisterProdutos[key] !== null) {
        data.append(key, RegisterProdutos[key]);
      }
    });

    // Adiciona o ID do usuário para identificação
    data.append("userId", userInfo.id_user);
    data.append("userName", userInfo.Nome_user);

    const id = userInfo.id_EmpresaDb ? userInfo.id_EmpresaDb : userInfo.id_user;

    try {
      const response = await axios.post(
        `/api/ServerTwo/RegistrarProduto/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Informações enviadas com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário.");
    }
  };

  // Função para exportar para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(ProductsEstoque); // Converte os dados do estoque para um worksheet
    const workbook = XLSX.utils.book_new(); // Cria uma nova pasta de trabalho
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos"); // Adiciona a planilha
    XLSX.writeFile(workbook, "produtos_estoque.xlsx"); // Gera o arquivo Excel
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Estoque</h3>
      </div>

      <div className="Estoque_Cad">
        <div className="Button_Cad">
          <button className="Button-Menu" onClick={handleShow}>
            Adicionar
            <FaPlus />
          </button>
          <button
            className="Button-Menu"
            onClick={() => handleShowEdit(selectedProduct)}
          >
            Editar
            <FaPenToSquare />
          </button>

          <button className="Button-Menu" onClick={exportToExcel}>
            Exportar
            <FaFileExport />
          </button>
        </div>

        {/* Input de pesquisa */}
        <div>
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="SearchInput"
          />
        </div>

        <div className="Estoque_List">
          <table id="table-to-export">
            <caption>Registro de Produtos</caption>
            <thead>
              <tr>
                <th>Código do produto</th>
                <th>Nome</th>
                <th>Fornecedor</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
                <th>Info.</th>
                <th>Selecionar</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.Codigo}</td>
                  <td>{product.Nome}</td>
                  <td>{product.Fornecedor}</td>
                  {/* Lógica para colorir a quantidade */}
                  <td
                    style={{
                      color:
                        product.Quantidade === 0
                          ? "red"
                          : product.Quantidade <= 5
                          ? "#e0861e"
                          : product.Quantidade <= 10
                          ? "#e0bf1e"
                          : "#6bbf1e", // Cor padrão se a quantidade for maior que 10
                    }}
                  >
                    {product.Quantidade}
                  </td>
                  <td>R$ {product.ValorUnitario}</td>
                  <td>
                    <button
                      className="ButtonInfoProduct"
                      onClick={() => handleShowInfo(product)}
                    >
                      Abrir
                    </button>
                  </td>
                  <td>
                    <label className="custom-radio">
                      <input
                        type="radio"
                        name="selectedProduct"
                        value={product.id}
                        onChange={() => setSelectedProduct(product)}
                      />
                      <span className="radio-checkmark"></span>
                    </label>
                  </td>
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
          background: "linear-gradient(135deg, #fff, #fff)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModal}
        onHide={handleClose}
      >
        <div className="DivModalCont">
          <div className="HeaderModal">
            <h1>Registrar Produto</h1>
          </div>
          <form onSubmit={Registro_Produto}>
            <input
              type="text"
              name="Nome"
              placeholder="Nome do produto"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              name="Fornecedor"
              placeholder="Fornecedor"
              onChange={handleChange}
            />
            <input
              type="number"
              name="Quantidade"
              placeholder="Quantidade"
              required
              onChange={handleChange}
            />
            <input
              type="number"
              name="ValorUnitario"
              placeholder="Preço por Unidade"
              value={RegisterProdutos.ValorUnitario}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="Tamanho"
              placeholder="Tamanho"
              required
              onChange={handleChange}
            />
            <input
              type="file"
              name="Imagem"
              placeholder="Imagem do produto"
              onChange={handleFileChange}
            />
            <div>
              <button className="RegisterPr" type="submit">
                Cadastrar
              </button>
              <button className="FecharPr" onClick={handleClose}>
                Fechar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 1000,
          width: "50%",
          height: "70%",
          borderRadius: "20px",
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(135deg, #ffffff, #f7f7f7)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModalEdit}
        onHide={handleCloseEdit}
      >
        <div className="FormsEdit">
          <div className="TitleEditProdut">
            <h1>Editar Produto</h1>
          </div>
          <div className="FormsEditProdut">
            <form onSubmit={updateProdutoAPI}>
              <input
                type="text"
                name="Nome"
                placeholder="Nome do produto"
                value={RegisterProdutos.Nome}
                onChange={handleChange}
              />
              <input
                type="text"
                name="Fornecedor"
                placeholder="Fornecedor"
                value={RegisterProdutos.Fornecedor}
                onChange={handleChange}
              />
              <input
                type="number"
                name="Quantidade"
                placeholder="Quantidade"
                value={RegisterProdutos.Quantidade}
                onChange={handleChange}
              />
              <input
                type="number"
                name="ValorUnitario"
                placeholder="Preço por Unidade"
                value={RegisterProdutos.ValorUnitario}
                onChange={handleChange}
              />
              <input
                type="text"
                name="Tamanho"
                placeholder="Tamanho"
                value={RegisterProdutos.Tamanho}
                onChange={handleChange}
              />

              <input
                type="file"
                name="Imagem"
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="buttons">
                <button variant="primary" type="submit" className="RegisterPr">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="FecharPr"
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Modal de Informações do Produto */}
      <Modal
        style={{
          position: "fixed",
          top: "50%",
          bottom: 0,
          left: "50%",
          right: 0,
          zIndex: 1000,
          width: "50%",
          height: "auto",
          borderRadius: 20,
          transform: "translate(-50%, -50%)",
          background: "linear-gradient(135deg, #fff, #fff)",
          boxShadow: "10px 15px 30px rgba(0, 0, 0, 0.6)",
        }}
        show={showModalInfo}
        onHide={handleCloseInfo}
      >
        {selectedProduct && (
          <div className="DivModalCont">
            <div className="HeaderModal">
              <h1>Informações do Produto</h1>
            </div>
            <div className="AlinhandoInfos">
              <div className="CorpoEtoque">
                <h3>Nome: {selectedProduct.Nome}</h3>
                <p>Fornecedor: {selectedProduct.Fornecedor}</p>
                <p>Quantidade: {selectedProduct.Quantidade}</p>
                <p>Valor Unitário: R$ {selectedProduct.ValorUnitario}</p>
                <button onClick={handleCloseInfo} className="FecharPr">
                  {" "}
                  FECHAR{" "}
                </button>
              </div>

              <div className="ImgEstoqueProduct">
                <img
                  src={`/api/ServerOne/uploads/ProdutosIMG/${selectedProduct.Imagem}`}
                  style={{ width: 100, height: 100 }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

export default RegistroProduto;
