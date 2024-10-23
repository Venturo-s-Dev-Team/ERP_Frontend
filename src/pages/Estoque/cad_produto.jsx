import React, { useState, useEffect } from "react";
import { FaFileExport } from "react-icons/fa";
import "./cad_produto.css";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Button, Modal } from "react-bootstrap";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function RegistroProduto() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ProductsEstoque, setSelectedEstoque] = useState([]);
  const [userInfo, setUserInfo] = useState({});
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

  const filteredProducts = ProductsEstoque.filter(
    (product) =>
      product.Nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.Codigo).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Estoque</h3>
        </div>

        <div className="Estoque_Cad">
          <div className="Button_Cad">
            <button className="Button-Menu" onClick={handleShow}>
              Adicionar
              <FaPlus />
            </button>
            <button onClick={() => handleShowEdit(selectedProduct)}>
              Editar
              <FaPenToSquare />
            </button>
            <button className="Button-Menu">
              Exportar
              <FaFileExport />
            </button>
          </div>
          {/* Input de pesquisa */}
          <div>
            <input
              type="text"
              placeholder="Pesquisar produtos..."
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
                    <td>{product.Quantidade}</td>
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
            <form>
              <input
                type="text"
                name="Nome"
                placeholder="Nome do produto"
                required
              />
              <input type="text" name="Fornecedor" placeholder="Fornecedor" />
              <input
                type="number"
                name="Quantidade"
                placeholder="Quantidade"
                required
              />
              <input
                type="number"
                name="ValorUnitario"
                placeholder="Preço por Unidade"
                value={RegisterProdutos.ValorUnitario}
                required
              />
              <input
                type="text"
                name="Tamanho"
                placeholder="Tamanho"
                required
              />
              <input
                type="file"
                name="Imagem"
                placeholder="Imagem do produto"
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
        >
          <div className="FormsEdit">
            <div className="TitleEditProdut">
              <h1>Editar Produto</h1>
            </div>
            <div className="FormsEditProdut">
              <form>
                <input
                  type="text"
                  name="Nome"
                  placeholder="Nome do produto"
                  value={RegisterProdutos.Nome}
                />
                <input
                  type="text"
                  name="Fornecedor"
                  placeholder="Fornecedor"
                  value={RegisterProdutos.Fornecedor}
                />
                <input
                  type="number"
                  name="Quantidade"
                  placeholder="Quantidade"
                  value={RegisterProdutos.Quantidade}
                />
                <input
                  type="number"
                  name="ValorUnitario"
                  placeholder="Preço por Unidade"
                  value={RegisterProdutos.ValorUnitario}
                />
                <input
                  type="text"
                  name="Tamanho"
                  placeholder="Tamanho"
                  value={RegisterProdutos.Tamanho}
                />

                <input type="file" name="Imagem" accept="image/*" />

                <div className="buttons">
                  <button
                    variant="primary"
                    type="submit"
                    className="RegisterPr"
                  >
                    Salvar
                  </button>
                  <button type="button" className="FecharPr">
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
                  <img />
                </div>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </SideBarPage>
  );
}

export default RegistroProduto;
