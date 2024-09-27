import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa";
import VenturoImg from "../../../images/ChatBotAssist.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as XLSX from "xlsx"; // Adiciona a importação da biblioteca xlsx
import "./componenteEstoque.css";

function SelecaoDoProduto() {
  const navigate = useNavigate();
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ProductsEstoque, setSelectedEstoque] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const handleShowInfo = (product) => {
    setSelectedProduct(product);
    setShowModalInfo(true);
  };

  const handleCloseInfo = () => {
    window.location.reload(); // Recarrega a página
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    if (userInfo.id_user) {
      fetchDados(userInfo.id_user);
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

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Estoque</h3>
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
              {ProductsEstoque.map((product) => (
                <tr key={product.id}>
                  <td>{product.Codigo}</td>
                  <td>{product.Nome}</td>
                  <td>{product.Fornecedor}</td>
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
  {product.name} {/* Exibe o nome do produto ao lado */}
</label>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
          }} show={showModalInfo} onHide={handleCloseInfo}>
          {selectedProduct && (
            <div className="DivModal">
            <div>
              <h1>Informações do Produto</h1>
            </div>
            <div className="AlinhandoInfos">
            <div>
            <h3>Nome: {selectedProduct.Nome}</h3>
            <p>Fornecedor: {selectedProduct.Fornecedor}</p>
            <p>Quantidade: {selectedProduct.Quantidade}</p>
            <p>Valor Unitário: R$ {selectedProduct.ValorUnitario}</p>
            <button onClick={handleCloseInfo} className="FecharPr"> FECHAR </button>
              </div>

        
          <div className="ImgEstoqueProduct">
          <img src={`/api/ServerOne/uploads/ProdutosIMG/${selectedProduct.Imagem}`} style={{width: 100, height: 100}}/>
            </div>
              </div>

    
            </div>
          )}
      </Modal>
    </main>
  );
}

export default SelecaoDoProduto;

