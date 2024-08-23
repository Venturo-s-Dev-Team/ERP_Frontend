import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate
} from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../pages/erp/Dashboard";
import DashboardAdmin from "../pages/erp/DashboardAdmin";
import Login from "../pages/Login";
import CadastroEmpresa from "../pages/CadastroEmpresa"

//E-MAIL
import Caixa_Saida from "../pages/erp/e-mail/Caixa_Saida";
import Caixa_Entrada from "../pages/erp/e-mail/Caixa_Entrada";

//PERFIL
import Perfil from "../pages/erp/Perfil/Perfil";

// ESTOQUE
import Cad_produto from "../pages/erp/estoque/cad_produto";

// FINANCEIRO

// CONTAS A PAGAR
import Despesas from "../pages/erp/financeiro/contaspagar/despesas";
import Fornecedores from "../pages/erp/financeiro/contaspagar/fornecedores";
import Pagamentos from "../pages/erp/financeiro/contaspagar/pagamentos";

// CONTAS A RECEBER
import Fluxodecaixa from "../pages/erp/financeiro/contasreceber/fluxodecaixa";
import Receitas from "../pages/erp/financeiro/contasreceber/receitas";

// IMPOSTO
import Cad_imposto from "../pages/erp/financeiro/imposto/cad_imposto";
import Cofins from "../pages/erp/financeiro/imposto/cofins";
import Csll from "../pages/erp/financeiro/imposto/csll";
import Icms from "../pages/erp/financeiro/imposto/icms";
import Ipi from "../pages/erp/financeiro/imposto/ipi";
import Irpj from "../pages/erp/financeiro/imposto/irpj";
import Iss from "../pages/erp/financeiro/imposto/iss";
import Pis from "../pages/erp/financeiro/imposto/pis";

// PLANOCONTAS
import Balancete from "../pages/erp/financeiro/planocontas/balancete";
import Dre from "../pages/erp/financeiro/planocontas/dre";
import Razao from "../pages/erp/financeiro/planocontas/razao";

// VENDAS
import Vendas from "../pages/erp/vendas/vendas";

// NOTAFISCAL
import Cadastronf from "../pages/erp/vendas/notafiscal/cadastronf";

// PEDIDOS
import Clientes from "../pages/erp/vendas/pedidos/clientes";
import Precofinal from "../pages/erp/vendas/pedidos/precofinal";

//ERROR
import Error from "../pages/erro/error";

//LANDPAGE
import Landpage from "../pages/erp/landpage/landpage"

//LOGSADMIN
import LogsAdmin from "../pages/erp/LogsAdmin/LogsAdmin"
import LogsAdminAnual from "../pages/erp/LogsAdmin/LogsAdminAnual"

//LOGOUT
import Logout from "../components/Logout";

function AppRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <RouteRenderer
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
    </Router>
  );
}

function RouteRenderer({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const isExcludedRoute = ["/", "/error","/CadastroEmpresa", "/login"].includes(location.pathname);

  // Função para verificar o token
 const [userInfo, setUserInfo] = useState('');
 const navigate = useNavigate();

 useEffect(() => {
  const verifyToken = async () => {
    try {
      const response = await axios.get('http://192.168.1.75:3002/verifyToken', { withCredentials: true });
      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } else if (response.status === 201) {
        alert('Refresh necessário');
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      }
    } catch (error) {
      console.error('Token inválido', error);
    }
  };

  verifyToken();
}, [navigate]);

  return (
    <div className="grid-container">
      {!isExcludedRoute && (
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<Landpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} /> //Apenas o userInfo.TypeUser === Gestor pode acessar
          <Route path="/dashboard" element={<Dashboard />} /> // Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path='/E-mail_Caixa_Saida' element={<Caixa_Saida />} />
          <Route path="/E-mail_Caixa_Entrada" element={<Caixa_Entrada />} /> 
          {userInfo?.Status !== 'NO' && (
            <>
          <Route path="/logs_admin" element={< LogsAdmin/>}/> // Apenas userInfo.TypeUser === SuperAdmin
          <Route path="/logs_adminAnual" element={< LogsAdminAnual/>}/> // Apenas userInfo.TypeUser === SuperAdmin

          <Route path="/dashboard_admin" element={<DashboardAdmin/> } />// Apenas userInfo.TypeUser === SuperAdmin
          <Route path="/cad_produto" element={<Cad_produto />} /> // Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/cadastronf" element={<Cadastronf />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/clientes" element={<Clientes />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/precofinal" element={<Precofinal />} /> // Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/vendas" element={<Vendas />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/despesas" element={<Despesas />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/fornecedores" element={<Fornecedores />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/pagamentos" element={<Pagamentos />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/fluxodecaixa" element={<Fluxodecaixa />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/receitas" element={<Receitas />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/cad_imposto" element={<Cad_imposto />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/cofins" element={<Cofins />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/csll" element={<Csll />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/icms" element={<Icms />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/ipi" element={<Ipi />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/irpj" element={<Irpj />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/iss" element={<Iss />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/pis" element={<Pis />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/balancete" element={<Balancete />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/dre" element={<Dre />} />// Apenas userInfo.TypeUser === Admin ou Gestor
          <Route path="/razao" element={<Razao />} />
          <Route path="*" element={<Navigate to="/error" />} />
          </> )}
          <Route path="/error" element={<Error errorCode={404 || 500} />} />
          <Route path="/logout" element={<Logout/>} />
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;
