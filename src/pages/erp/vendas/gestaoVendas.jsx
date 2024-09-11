import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const Vendas = [
  { id: 1, razaoSocial: 'Empresa A', codigo: '001', preco: '1000.00', descricao: 'Produto A', precoBruto: '1200.00', precoFinal: '1000.00' },
  { id: 2, razaoSocial: 'Empresa B', codigo: '002', preco: '1500.00', descricao: 'Produto B', precoBruto: '1800.00', precoFinal: '1500.00' },
];

const GestaoVendas = () => {
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);

  const handleShowInfo = (venda) => {
    setSelectedVenda(venda);
    setShowModalInfo(true);
  };

  
  const handleCloseInfo = () => {
    setShowModalInfo(false);
    setSelectedVenda(null);
  };

  return (
    <main className="main-container">
    <div className="main-title">
      <h3>Gestão de Vendas</h3>
    </div>

    <div className="formulario"> 

{/* Emitente */}
    <div className="emitente">
          <h5 className="mini-titulo-nf"> Emitente </h5>

          {/* Emitente - razão social */}
           <div className="razao-social">
             <label className="letras-nf">Razão Social:</label>
               <input
                type="text"
                name="razaoSocial"
               className="input-rs"
               />
        </div>

        {/* Emitente - cpf */}
        <div className="cpf">
          <label className="letras-nf">CPF/CNPJ:</label>
          <input
            type="text"
            name="cpfCnpj"
            className="input-cpf"
          />
         </div>
</div>

{/* Endereço */}
<div className="endereço">
        <h5 className="mini-titulo-nf">Endereço</h5> 

        {/* Endereço - logradouro */}
        <div className="logradouro">
          <label>Logradouro:</label>
          <input
            type="text"
            name="logradouro"
            className="input-logra"
          />
        </div>

        {/* Endereço - numero */}
        <div className="numero">
          <label>Número:</label>
          <input
            type="text"
            name="numero"
            className="input-numero"
          />
        </div>

        {/* Endereço - complemento */}
        <div className="complemento">
          <label>Complemento:</label>
          <input
            type="text"
            name="complemento"
            className="input-complemento"
          />
        </div>

        {/* Endereço - cidade */}
        <div className="cidade">
          <label>Cidade:</label>
          <input
            type="text"
            name="cidade"
            className="input-cidade"
          />
        </div>

        {/* Endereço - estado */}
        <div className="estado">
          <label>Estado:</label>
          <input
            type="text"
            name="estado"
            className="input-estado"
          />
        </div>

        {/* Endereço - tipo */}
        <div className="tipo">
          <label>Tipo de Pagamento:</label>
          <select
            name="tipoPagamento"
            className="select-tipo"
          >
            <option value="">Selecione</option>
            <option value="boleto">Boleto</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>
        </div>


{/* Produto */}
<div className="produto-geral">
<h5 className="mini-titulo-nf">Venda</h5>
       
        
{/* Produto - frete */}
        <div className="frete">
          <label>Frete:</label>
          <input
            type="number"
            name="frete"
            className="input-frete"
          />
        </div>

        
{/* Produto - desconto */}
        <div className="desconto">
          <label>Desconto:</label>
          <input
            type="number"
            name="desconto"
            className="input-desconto"
          />   
        </div> 

        
{/* Produto - código */}
        <div className="código">
          <label>Código da Venda:</label>
          <input
            type="text"
            name="desconto"
            className="input-código"
          />
          </div>
             </div>


{/* Resumo */}
<div className="resumo">
<h5 className="mini-titulo-nf-especial">Resumo de Preços</h5>


{/* Resumo - preço bruto */}
        <div className="preco-bruto">
          <label>Preço Bruto:</label>
          <input className="input-preco-bruto" type="number" name="precoBruto"   />
        </div>

        
{/* Resumo - preço final */}
        <div className="preco-final">
          <label>Preço Final:</label>
          <input className="input-preco-final" type="number" name="precoFinal"   />
        </div>  </div>

        

{/* Descrição */}
<div className="descricao">
<h5 className="mini-titulo-nf-especial">Descrição</h5>


{/* Descrição - descrição do produto */}
        <div className="descricao-do-produto">
          <label>Descrição do Produto:</label>
          <input className="input-descricao-produto"  type="text" name="descricao"   />
        </div>

 </div>

      </div>

      
 
      <div className="Gestao-List">
          <table>
            <caption>Registro de Vendas</caption>
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>Código da Venda</th>
                <th>Preço</th>
                <th>Preço Bruto</th>
                <th>Preço Final</th>
                <th>Info.</th>
              </tr>
            </thead>
            <tbody>
            {Vendas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.razaoSocial}</td>
                <td>{venda.codigo}</td>
                <td>{venda.preco}</td>
                <td>{venda.precoBruto}</td>
                <td>{venda.precoFinal}</td>
                
                <td> <button className='btn-ver-mais' onClick={() => handleShowInfo(venda)}>
                    Ver Mais
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
        <Modal
        style={{
          position: "fixed",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          height: 280,
          overflowY: "auto",
          borderRadius: 10,
          background: "#fff",
          boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.6)",
          
  border: "#000000d1",
        }}
        show={showModalInfo}
        onHide={handleCloseInfo}
      >
        <Modal.Header closeButton>
          <Modal.Title className="title-modal">Informações da Venda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVenda ? (
            <div>
              <h4 className="h4-modal">Nome da Empresa: {selectedVenda.razaoSocial}</h4>
             <div className="textos-modal"> 
              <p>Código da Venda: {selectedVenda.codigo}</p>
              <p>Descrição: {selectedVenda.descricao}</p>
              <p>Preço: {selectedVenda.preco}</p>
              <p>Preço Bruto: {selectedVenda.precoBruto}</p>
              <p>Preço Final: {selectedVenda.precoFinal}</p>
              </div>
            </div>
          ) : (
            <p>Não há informações disponíveis.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfo} className="btn-fechar-modal">
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default GestaoVendas;
