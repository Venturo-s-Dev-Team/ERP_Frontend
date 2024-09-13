import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {  FaPlus } from "react-icons/fa6";

function Cad_nf() {
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cpfCnpj: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      cidade: '',
      estado: ''
    },
    tipoPagamento: '',
    valor: 0,
    icms: 0,
    ipi: 0,
    frete: 0,
    desconto: 0,
    precoBruto: 0,
    precoFinal: 0,
    produtos: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      endereco: { ...formData.endereco, [name]: value }
    });
  };

  const handleProdutoChange = (index, e) => {
    const { name, value } = e.target;
    const produtos = [...formData.produtos];
    produtos[index] = { ...produtos[index], [name]: value };
    setFormData({ ...formData, produtos });
  };

  const addProduto = () => {
    setFormData({ ...formData, produtos: [...formData.produtos, { nome: '', preco: 0 }] });
  };

  const removeProduto = (index) => {
    const produtos = formData.produtos.filter((_, i) => i !== index);
    setFormData({ ...formData, produtos });
  };

  const calculateValues = () => {
    const precoBruto = formData.produtos.reduce((acc, produto) => acc + parseFloat(produto.preco || 0), 0);
    const icms = precoBruto * 0.18;
    const ipi = precoBruto * 0.05;
    const precoFinal = precoBruto + icms + ipi + parseFloat(formData.frete || 0) - parseFloat(formData.desconto || 0);
    setFormData({ ...formData, precoBruto, icms, ipi, precoFinal });
  };

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
  
    const img = new Image();
    img.src = '/src/images/Venturo.png';
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 50, 30);
  
      // Cabeçalho
      doc.setFontSize(12);
      doc.text('NOTA FISCAL', 105, 10, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Razão Social: ${formData.razaoSocial}`, 10, 20);
      doc.text(`CPF/CNPJ: ${formData.cpfCnpj}`, 10, 25);
      doc.text(`Endereço: ${formData.endereco.logradouro}, ${formData.endereco.numero}, ${formData.endereco.complemento}`, 10, 30);
      doc.text(`Cidade: ${formData.endereco.cidade} - ${formData.endereco.estado}`, 10, 35);
      
      // Produtos
      doc.text('Produtos:', 10, 45);
      autoTable(doc, {
        startY: 50,
        head: [['Produto', 'Preço']],
        body: formData.produtos.map(produto => [produto.nome, `R$ ${parseFloat(produto.preco).toFixed(2)}`]),
        theme: 'grid',
      });
  
      // Resumo de valores
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Descrição', 'Valor']],
        body: [
          ['Preço Bruto', `R$ ${parseFloat(formData.precoBruto).toFixed(2)}`],
          ['ICMS (18%)', `R$ ${parseFloat(formData.icms).toFixed(2)}`],
          ['IPI (5%)', `R$ ${parseFloat(formData.ipi).toFixed(2)}`],
          ['Frete', `R$ ${parseFloat(formData.frete).toFixed(2)}`],
          ['Desconto', `R$ ${parseFloat(formData.desconto).toFixed(2)}`],
          ['Preço Final', `R$ ${parseFloat(formData.precoFinal).toFixed(2)}`],
        ],
        theme: 'grid',
      });
  
      // Rodapé
      doc.setFontSize(8);
      doc.text('NF-e Emitida em Ambiente de Homologação - Sem Valor Fiscal', 105, doc.internal.pageSize.height - 10, { align: 'center' });
  
      doc.save('nota_fiscal.pdf');
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateValues();
    generatePDF();
    console.log("Nota Emitida");
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Emissão de Nota Fiscal</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="emitente">
          <h5 className="mini-titulo-nf"> Emitente </h5>
         <div className="razao-social">
          <label className="letras-nf">Razão Social:</label>
          <input
            type="text"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleInputChange}
            className="input-rs"
          />
        </div>
        <div className="cpf">
          <label className="letras-nf">CPF/CNPJ:</label>
          <input
            type="text"
            name="cpfCnpj"
            className="input-cpf"
            value={formData.cpfCnpj}
            onChange={handleInputChange}
            
          />
         </div>
</div>
<div className="endereço">
        <h5 className="mini-titulo-nf">Endereço</h5>
        <div className="logradouro">
          <label>Logradouro:</label>
          <input
            type="text"
            name="logradouro"
            value={formData.endereco.logradouro}
            onChange={handleEnderecoChange}
            className="input-logra"
          />
        </div>
        <div className="numero">
          <label>Número:</label>
          <input
            type="text"
            name="numero"
            value={formData.endereco.numero}
            onChange={handleEnderecoChange}
            className="input-numero"
          />
        </div>
        <div className="complemento">
          <label>Complemento:</label>
          <input
            type="text"
            name="complemento"
            value={formData.endereco.complemento}
            onChange={handleEnderecoChange}
            className="input-complemento"
          />
        </div>
        <div className="cidade">
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={formData.endereco.cidade}
            onChange={handleEnderecoChange}
            className="input-cidade"
          />
        </div>
        <div className="estado">
          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            value={formData.endereco.estado}
            onChange={handleEnderecoChange}
            className="input-estado"
          />
        </div>

        <div className="tipo">
          <label>Tipo de Pagamento:</label>
          <select
            name="tipoPagamento"
            value={formData.tipoPagamento}
            onChange={handleInputChange}
            className="select-tipo"
          >
            <option value="">Selecione</option>
            <option value="boleto">Boleto</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>
        </div>

<div className="produto-geral">
<h5 className="mini-titulo-nf">Venda</h5>
       

        <div className="frete">
          <label>Frete:</label>
          <input
            type="number"
            name="frete"
            value={formData.frete}
            onChange={handleInputChange}
            onBlur={calculateValues}
            className="input-frete"
          />
        </div>
        <div className="desconto">
          <label>Desconto:</label>
          <input
            type="number"
            name="desconto"
            value={formData.desconto}
            onChange={handleInputChange}
            onBlur={calculateValues}
            className="input-desconto"
          />
          
        </div> 
        <div className="código">
          <label>Código da Venda:</label>
          <input
            type="text"
            name="desconto"
            value={formData.desconto}
            onChange={handleInputChange}
            onBlur={calculateValues}
            className="input-código"
          />
          </div>
             </div>


<div className="impostos">
<h5 className="mini-titulo-nf-especial">Cálculo de Impostos</h5>
        <div className="icms">
          <label>ICMS (18%):</label>
          <input type="number" name="icms" value={formData.icms} readOnly className="input-icms"/>
        </div>

        <div className="ipi">
          <label>IPI (5%):</label>
          <input className="input-ipi" type="number" name="ipi" value={formData.ipi} readOnly />
        </div>
</div>

<div className="resumo">
<h5 className="mini-titulo-nf-especial">Resumo de Preços</h5>
        <div className="preco-bruto">
          <label>Preço Bruto:</label>
          <input className="input-preco-bruto" type="number" name="precoBruto" value={formData.precoBruto} readOnly />
        </div>
        <div className="preco-final">
          <label>Preço Final:</label>
          <input className="input-preco-final" type="number" name="precoFinal" value={formData.precoFinal} readOnly />
        </div>  </div>

        <button className="emitir" type="submit">Emitir Nota Fiscal</button>
      </form>

  </main>
  );
}

export default Cad_nf;
