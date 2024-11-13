import React, { useState, useEffect } from "react";
import { FaPenToSquare, FaPlus, FaTrashCan } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./fluxodecaixa.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function FluxoCaixa() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [fluxos, setFluxos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState(0); // Estado para o saldo inicial
  const [saldoDisponivel, setSaldoDisponivel] = useState(0); // Estado para o saldo disponível para o dia seguinte

  // Função para abrir modal
  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  // Função para filtrar os fluxos do dia atual
  const filtrarFluxosDoDia = () => {
    const hoje = new Date();
    return fluxos.filter(
      (fluxo) =>
        new Date(fluxo.DataExpiracao).toDateString() === hoje.toDateString()
    );
  };

  const fluxosDoDia = filtrarFluxosDoDia();

  return (
    <SideBarPage>
      <main>
        <div className="main-title">
          <h3>Fluxo de Caixa</h3>
        </div>
        <div className="scroll-despesas">
          <div className="box_fluxo">
            <div className="saldo1-box">
              <h3>Saldo inicial do dia anterior</h3>
              <h1>R$ {saldoInicial.toFixed(2)}</h1>{" "}
              {/* Exibir o saldo calculado */}
            </div>
            <div className="saldo2-box">
              <h3>Saldo disponível para o dia seguinte</h3>
              <h1>R$ {saldoDisponivel.toFixed(2)}</h1>
              {/* Exibir o saldo calculado */}
            </div>
          </div>

          <div className="Fluxos_List">
            <table>
              <caption>Fluxo de Caixa - Diário</caption>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                </tr>
              </thead>
              <tbody>
                {fluxosDoDia.map((fluxo) => (
                  <tr key={fluxo.id}>
                    <td>{fluxo.descricao}</td>
                    <td>R$ {fluxo.entrada}</td>
                    <td>R$ {fluxo.saida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default FluxoCaixa;
