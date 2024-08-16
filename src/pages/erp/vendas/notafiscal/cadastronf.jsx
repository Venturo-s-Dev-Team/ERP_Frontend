import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jsPDF-autoTable';

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
    const precoFinal = precoBruto + icms + ipi + parseFloat(formData.frete) - parseFloat(formData.desconto);
    setFormData({ ...formData, precoBruto, icms, ipi, precoFinal });
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = '/src/images/Venturo.png'; 
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 50, 30);
  
      doc.text('Nota Fiscal', 20, 50);
      doc.text(`Razão Social: ${formData.razaoSocial}`, 20, 60);
      doc.text(`CPF/CNPJ: ${formData.cpfCnpj}`, 20, 70);
      doc.text(`Endereço: ${formData.endereco.logradouro}, ${formData.endereco.numero}, ${formData.endereco.complemento}`, 20, 80);
      doc.text(`Cidade: ${formData.endereco.cidade} - ${formData.endereco.estado}`, 20, 90);
      doc.text(`Tipo de Pagamento: ${formData.tipoPagamento}`, 20, 100);
  
      // Adiciona tabela de produtos
      doc.text('Produtos:', 20, 110);
      doc.autoTable({
        startY: 120,
        head: [['Produto', 'Preço']],
        body: formData.produtos.map(produto => [produto.nome, `R$ ${parseFloat(produto.preco).toFixed(2)}`]),
        theme: 'grid',
      });
  
      // Adiciona tabela de valores
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [['Descrição', 'Valor']],
        body: [
          ['Preço Bruto', `R$ ${formData.precoBruto.toFixed(2)}`],
          ['ICMS (18%)', `R$ ${formData.icms.toFixed(2)}`],
          ['IPI (5%)', `R$ ${formData.ipi.toFixed(2)}`],
          ['Frete', `R$ ${formData.frete.toFixed(2)}`],
          ['Desconto', `R$ ${formData.desconto.toFixed(2)}`],
          ['Preço Final', `R$ ${formData.precoFinal.toFixed(2)}`],
        ],
        theme: 'grid',
      });
  
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
    <div className="App">
      <h1>Emissão de Nota Fiscal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Razão Social:</label>
          <input
            type="text"
            name="razaoSocial"
            value={formData.razaoSocial}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>CPF/CNPJ:</label>
          <input
            type="text"
            name="cpfCnpj"
            value={formData.cpfCnpj}
            onChange={handleInputChange}
          />
        </div>

        <h3>Endereço</h3>
        <div>
          <label>Logradouro:</label>
          <input
            type="text"
            name="logradouro"
            value={formData.endereco.logradouro}
            onChange={handleEnderecoChange}
          />
        </div>
        <div>
          <label>Número:</label>
          <input
            type="text"
            name="numero"
            value={formData.endereco.numero}
            onChange={handleEnderecoChange}
          />
        </div>
        <div>
          <label>Complemento:</label>
          <input
            type="text"
            name="complemento"
            value={formData.endereco.complemento}
            onChange={handleEnderecoChange}
          />
        </div>
        <div>
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={formData.endereco.cidade}
            onChange={handleEnderecoChange}
          />
        </div>
        <div>
          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            value={formData.endereco.estado}
            onChange={handleEnderecoChange}
          />
        </div>

        <div>
          <label>Tipo de Pagamento:</label>
          <select
            name="tipoPagamento"
            value={formData.tipoPagamento}
            onChange={handleInputChange}
          >
            <option value="">Selecione</option>
            <option value="boleto">Boleto</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        <h3>Produtos</h3>
        {formData.produtos.map((produto, index) => (
          <div key={index}>
            <label>Produto:</label>
            <input
              type="text"
              name="nome"
              value={produto.nome}
              onChange={(e) => handleProdutoChange(index, e)}
            />
            <label>Preço:</label>
            <input
              type="number"
              name="preco"
              value={produto.preco}
              onChange={(e) => handleProdutoChange(index, e)}
            />
            <button type="button" onClick={() => removeProduto(index)}>Remover Produto</button>
          </div>
        ))}
        <button type="button" onClick={addProduto}>Adicionar Produto</button>

        <div>
          <label>Frete:</label>
          <input
            type="number"
            name="frete"
            value={formData.frete}
            onChange={handleInputChange}
            onBlur={calculateValues}
          />
        </div>
        <div>
          <label>Desconto:</label>
          <input
            type="number"
            name="desconto"
            value={formData.desconto}
            onChange={handleInputChange}
            onBlur={calculateValues}
          />
        </div>

        <h3>Cálculo de Impostos</h3>
        <div>
          <label>ICMS (18%):</label>
          <input type="number" name="icms" value={formData.icms} readOnly />
        </div>
        <div>
          <label>IPI (5%):</label>
          <input type="number" name="ipi" value={formData.ipi} readOnly />
        </div>

        <h3>Resumo de Preços</h3>
        <div>
          <label>Preço Bruto:</label>
          <input type="number" name="precoBruto" value={formData.precoBruto} readOnly />
        </div>
        <div>
          <label>Preço Final:</label>
          <input type="number" name="precoFinal" value={formData.precoFinal} readOnly />
        </div>

        <button type="submit">Emitir Nota Fiscal</button>
      </form>
    </div>
  );
}

export default Cad_nf;








