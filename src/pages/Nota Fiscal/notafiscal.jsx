import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./notafiscal.css";

function NotaFiscal() {
  return (
    <main>
      <div className="main-titleNF">
        <h3>Emissão de Nota Fiscal</h3>
      </div>

      <form className="Formulario-NF"></form>
    </main>
  );
}

export default NotaFiscal;
