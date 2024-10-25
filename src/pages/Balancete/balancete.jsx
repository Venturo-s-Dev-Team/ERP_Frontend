import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./balancete.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const contas = [
  {
    id: 1,
    grupo: "Um",
    saldo: 2143,
    descricao: "Conta 1",
    mascara: 123,
    entrada: 1234,
    saida: 213,
  },
];

function Balancete() {
  return (
    <SideBarPage>
      <main>
        <div className="main-titleBC">
          <h3>Balancete</h3>
        </div>

        <div className="PlanoSelect-Div">
          <label className="LabelSelect-BC">
            Selecione o Plano de Contas:{" "}
          </label>
          <select className="Select-BC">
            <option value="">Selecione</option>
          </select>
        </div>

        {/* Tabela do Balancete */}
        <div className="Balancete_List">
          <table>
            <caption className="Caption-BC">Relatório Balancete</caption>
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Descrição</th>
                <th>Conta</th>
                <th>Saldo</th>
                <th>Entrada</th>
                <th>Saída</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.grupo}</td>
                  <td>{conta.descricao}</td>
                  <td>{conta.mascara}</td>
                  <td>{conta.saldo}</td>
                  <td>{conta.entrada}</td>
                  <td>{conta.saida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Balancete;
