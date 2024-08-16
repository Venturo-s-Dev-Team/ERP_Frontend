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
  const isExcludedRoute = ["/", "/error","/CadastroEmpresa", "/landpage"].includes(location.pathname);

  // Função para verificar o token
 const [userInfo, setUserInfo] = useState('');
 const navigate = useNavigate();

 useEffect(() => {
  const verifyToken = async () => {
    try {
      const response = await axios.get('http://10.144.170.13:3001/verifyToken', { withCredentials: true });
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
      navigate('/');
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
          <Route path="/" element={<Login />} />
          <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {userInfo?.Status !== 'NO' && (
            <>
          <Route path="/dashboard_admin" element={<DashboardAdmin />} />
          <Route path="/cad_produto" element={<Cad_produto />} />
          <Route path="/cadastronf" element={<Cadastronf />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/precofinal" element={<Precofinal />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/fluxodecaixa" element={<Fluxodecaixa />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/cad_imposto" element={<Cad_imposto />} />
          <Route path="/cofins" element={<Cofins />} />
          <Route path="/csll" element={<Csll />} />
          <Route path="/icms" element={<Icms />} />
          <Route path="/ipi" element={<Ipi />} />
          <Route path="/irpj" element={<Irpj />} />
          <Route path="/iss" element={<Iss />} />
          <Route path="/pis" element={<Pis />} />
          <Route path="/balancete" element={<Balancete />} />
          <Route path="/dre" element={<Dre />} />
          <Route path="/razao" element={<Razao />} />
          <Route path="/error" element={<Error errorCode={404} />} />
          <Route path="*" element={<Navigate to="/error" />} />
          </> )}
          <Route path="/landpage" element={<Landpage/>}/>
          <Route path="/logout" element={<Logout/>} />
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;
