import React, { useState } from "react";
import InputMask from "react-input-mask";
import { FaPlus } from "react-icons/fa6";
import "./notafiscal.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function NotaFiscal() {
  const [produtos, setProdutos] = useState([{ produto: "", preco: "" }]);

  const handleAddProduct = () => {
    setProdutos([...produtos, { produto: "", preco: "" }]);
  };

  const handleRemoveProduct = (index) => {
    const newProdutos = produtos.filter((_, i) => i !== index);
    setProdutos(newProdutos);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProdutos = produtos.map((produto, i) =>
      i === index ? { ...produto, [name]: value } : produto
    );
    setProdutos(newProdutos);
  };

  return (
    <SideBarPage>
      <main>
        <div className="main-titleNF">
          <h3>Emissão de Nota Fiscal</h3>
        </div>

        <div className="scroll-despesas">
          <form className="Formulario-NF">
            {/* Parte Emitente */}
            <div className="EmitenteDiv-CadEmp">
              <legend>Emitente</legend>
              <div className="Campo-Razão">
                <label>
                  Razão Social:
                  <InputMask type="text" required />
                </label>
              </div>
              <div className="Campo-CNPJ">
                <label>
                  CPF/CNPJ:
                  <InputMask   mask="999.999.999-99" type="text" required />
                </label>
              </div>
            </div>

            {/* Parte Endereço */}
            <div className="EndereçoDiv-CadEmpNota">
              <legend>Endereço</legend>
              <div className="Campo-Logra">
                <label>
                  Logradouro:
                  <InputMask type="text" required />
                </label>
              </div>
              <div className="Campo-Numero">
                <label>
                  Número:
                  <InputMask mask="(99)99999-9999" type="text" required />
                </label>
              </div>
              <div className="Campo-Complemento">
                <label>
                  Complemento:
                  <InputMask type="text" required />
                </label>
              </div>
              <div className="Campo-Cidade">
                <label>
                  Cidade:
                  <InputMask type="text" required />
                </label>
              </div>
              <div className="Campo-Estado">
                <label>
                  Estado:
                  <InputMask type="text" required />
                </label>
              </div>
              <div className="Campo-TipoPagamento">
                <label>Tipo de Pagamento:</label>
                <select name="tipoPagamento">
                  <option value="">Selecione</option>
                  <option value="boleto">Boleto</option>
                  <option value="cartao">Cartão</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
            </div>

            {/* Parte Venda */}
            <div className="VendaDiv-CadEmp">
              <legend>Venda</legend>
              <div className="Campo-Frete">
                <label>
                  Frete:
                  <InputMask type="number" required />
                </label>
              </div>

              <div className="Campo-Desconto">
                <label>
                  Desconto:
                  <InputMask type="number" required />
                </label>
              </div>

              <div className="Campo-Codigo">
                <label>
                  Código da Venda:
                  <InputMask type="number" required />
                </label>
              </div>

              {produtos.map((produto, index) => (
                <div key={index} className="Campo-Produto">
                  <label>
                    Produto:
                    <InputMask
                      type="text"
                      value={produto.produto}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                  </label>
                  <div className="Campo-Preço">
                    <label>
                      Preço:
                      <InputMask
                        type="text"
                        value={produto.preco}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </label>
                  </div>
                  <div className="Campo-Btn">
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="Btn-Remover"
                    >
                      Remover Produto
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddProduct}
                className="Btn-Adicionar"
              >
                Adicionar Produto <FaPlus />
              </button>
            </div>

            {/* Parte Impostos */}
            <div className="ImpostosDiv-CadEmp">
              <legend>Impostos</legend>
              <div className="Campo-ICMS">
                <label>
                  ICMS (18%):
                  <InputMask type="text" required />
                </label>
              </div>

              <div className="Campo-IPI">
                <label>
                  IPI (5%):
                  <InputMask type="text" required />
                </label>
              </div>
            </div>

            {/* Parte Impostos */}
            <div className="ResumoDiv-CadEmp">
              <legend>Resumo de Preços</legend>
              <div className="Campo-PreçoBr">
                <label>
                  Preço Bruto:
                  <InputMask type="text" required />
                </label>
              </div>

              <div className="Campo-PreçoFn">
                <label>
                  Preço Final:
                  <InputMask type="text" required />
                </label>
              </div>
            </div>
            {/* Botão de Emitir */}
            <button className="Botao-Emitir" type="submit">
              Emitir Nota Fiscal
            </button>
          </form>
        </div>
      </main>
    </SideBarPage>
  );
}

export default NotaFiscal;