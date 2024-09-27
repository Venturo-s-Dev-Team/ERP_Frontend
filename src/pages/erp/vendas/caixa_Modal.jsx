import { Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import "./caixa_Modal.css";

function Caixa_Modal() {


  return (
    <main className="main-container">
      <div className="valor-caixa">
       <h1>
        Valor Total: R$ 1.000,00
        </h1>
</div>
<div className="valor-caixa">
<input type="text" className="input-caixas-modal" placeholder="Digite aqui..."/>
       <h2  className="caixa-modal-h">
        Troco: R$ 220,00
        </h2>
</div>
<button className="btn-caixa">Prosseguir</button>
    </main>
  );
}

export default Caixa_Modal;
