import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Landpage from "../pages/LandPage/landpage";
import Login from "../pages/Login/Login";
import Balancete from "../pages/Balancete/balancete";
import Home from "../pages/Dashboard/dashboard";
import HomeAdmin from "../pages/Dashboard Admin/dashboardAdmin";
import RegistroProduto from "../pages/Estoque/cad_produto";
import Error from "../pages/Error/Erros";
import Caixa_Entrada from "../pages/Email/caixaEntrada";
import Caixa_Saida from "../pages/Email/caixaSaida";
import Perfil from "../pages/Perfil/perfilUser";
import Fornecedores from "../pages/Fornecedores/fornecedores";
import Pagamentos from "../pages/Pagamentos/pagamentos";
import Perfil_Admin from "../pages/Perfil/perfilAdmin";
import Cad_Empresa from "../pages/CadastrarEmpresa/cad_empresa";
import CadastroFuncionario from "../pages/Registrar Funcionário/registrarFuncionario";
import Despesas from "../pages/Despesas/despesas";
import FluxoCaixa from "../pages/Fluxo de Caixa/fluxodecaixa";
import Receitas from "../pages/Receitas/receitas";
import Dre from "../pages/Dre/dre";
import NotaFiscal from "../pages/Nota Fiscal/notafiscal";
import LanContabil from "../pages/Lançamento Contábil/lanc_contabil";
import Razao from "../pages/Razão/razao";
import Clientes from "../pages/Clientes/clientes";
import GestaoVendas from "../pages/AbasGestãoPedidos/gestaoVendas";
import Abas from "../pages/AbasGestãoPedidos/Abas";
import PedidosCancelados from "../pages/Pedidos Cancelados/pedidosCancelados";
import Caixa_Modal from "../pages/Caixa/caixa_Modal";
import Caixa_Pagamentos from "../pages/Caixa/caixa_Pagamentos";
import LogsEmpresa from "../pages/LogsSystem/LogsEmpresa";
import LogsAdmin from "../pages/LogsSystem/logsAdmin";
import AbasForUpdate from "../pages/AbasGestãoPedidos/AbasUpdate";
import Hist_vendas from "../pages/Vendas/vendas";
import Caixa from "../pages/Caixa/Caixa";
import Logout from "../components/Logout";
import VerMais from "../pages/Ver Mais/verMais";
import AtualizarSenha from "../pages/Registrar Funcionário/AtualizarSenha";

function AppRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <RouteRenderer openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
    </Router>
  );
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });

        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else if (response.status === 201) {
          alert("Refresh necessário");
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login"); // Redireciona para login se token for inválido
      }
    };

    verifyToken();
  }, [navigate]);

  if (!userInfo) {
    return <div>Carregando...</div>;
  }

  return allowedRoles.includes(userInfo.TypeUser) ? (
    children
  ) : (
    <Navigate to="/error" />
  );
};


function RouteRenderer({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const isExcludedRoute = ["/", "/error", "/CadastroEmpresa", "/login"].includes(
    location.pathname
  );

  return (
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Landpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/email_entrada" element={<Caixa_Entrada />} />
        <Route path="/email_saida" element={<Caixa_Saida />} />
        <Route path="/perfil_user" element={<Perfil />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/verMais" element={<VerMais />} />
        
        {/* Rotas Protegidas */}
        <Route
          path="/balancete"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Socio"]}>
              <Balancete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Gestor", "Gerente", "Financeiro", "Socio"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardAdmin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cad_produtos"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gestor", "Estoque"]}>
              <RegistroProduto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fornecedores"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Gerente", "Socio", "Venda"]}>
              <Fornecedores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagamentos"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Socio"]}>
              <Pagamentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil_admin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <Perfil_Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cad_empresa"
          element={
            <ProtectedRoute allowedRoles={["Gestor", "Socio"]}>
              <Cad_Empresa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <ProtectedRoute allowedRoles={["Gestor", "Gerente", "Socio"]}>
              <CadastroFuncionario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AtualizarSenha"
          element={
            <ProtectedRoute allowedRoles={["Gestor", "Gerente", "Socio"]}>
              <AtualizarSenha />
            </ProtectedRoute>
          }
        />
        <Route
          path="/despesas"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gestor", "Financeiro"]}>
              <Despesas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fluxocaixa"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gestor", "Financeiro", "Caixa"]}>
              <FluxoCaixa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receitas"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gestor", "Financeiro"]}>
              <Receitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dre"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Socio"]}>
              <Dre />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notafiscal"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gestor", "Financeiro"]}>
              <NotaFiscal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lancontabil"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Socio"]}>
              <LanContabil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/razao"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gestor", "Socio"]}>
              <Razao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute allowedRoles={["Financeiro", "Gerente", "Gestor", "Socio"]}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestaoVendas"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gerente", "Gestor", "Venda"]}>
              <GestaoVendas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/histVendas"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gerente", "Gestor", "Venda"]}>
              <Hist_vendas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abas"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gerente", "Gestor", "Venda"]}>
              <Abas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abasUpdate"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gerente", "Gestor", "Venda"]}>
              <AbasForUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidoscancelados"
          element={
            <ProtectedRoute allowedRoles={["Socio", "Gerente", "Gestor", "Venda"]}>
              <PedidosCancelados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caixa"
          element={
            <ProtectedRoute allowedRoles={["Caixa", "Gestor", "Socio"]}>
              <Caixa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caixa_modal"
          element={
            <ProtectedRoute allowedRoles={["Caixa", "Gestor", "Socio"]}>
              <Caixa_Modal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caixa_pagamentos"
          element={
            <ProtectedRoute allowedRoles={["Caixa", "Gestor", "Socio"]}>
              <Caixa_Pagamentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logsEmpresa"
          element={
            <ProtectedRoute allowedRoles={["Gestor", "Gerente", "Socio"]}>
              <LogsEmpresa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logsAdmin"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <LogsAdmin />
            </ProtectedRoute>
          }
        />
     
      </Routes>
  );
}

export default AppRoutes;
