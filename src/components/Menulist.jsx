import { Menu } from "antd";
import {
  MoneyCollectOutlined,
  AreaChartOutlined,
  PayCircleOutlined,
  StockOutlined,
} from "@ant-design/icons";
import {
  BsFillArchiveFill,
  BsPeopleFill,
  BsFillBellFill,
  BsListCheck,
} from "react-icons/bs";
import { MdLogout, MdOutlineMailOutline } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoPieChartSharp } from "react-icons/io5";
import { RiContactsBook3Fill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./Sidebar.css";

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('/api/ServerTwo/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/login');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path, {state: {userName: userInfo.Nome_user, userId: userInfo.id_user, id_EmpresaDb: userInfo.id_EmpresaDb}});
  };

  const isRestricted = userInfo?.Status === 'NO';
  const isSuperAdmin = userInfo?.TypeUser === 'SuperAdmin';

  const menuItems = [
    isSuperAdmin && {
      key: "dashboard_admin",
      icon: <IoPieChartSharp />,
      label: "Dashboard Admin",
      onClick: () => handleNavigation("/dashboard_admin"),
    },
    isSuperAdmin && {
      key: "logs_admin",
      icon: <RiContactsBook3Fill />,
      label: "Logs Admin",
      onClick: () => handleNavigation("/logs_admin"),
    },
    !isRestricted && !isSuperAdmin && {
      key: "Dashboard",
      icon: <IoPieChartSharp />,
      label: "Dashboard",
      onClick: () => handleNavigation("/dashboard"),
    },
    {
      key: 'Caixa_Entrada',
      icon: <MdOutlineMailOutline />,
      label: "E-mail",
      onClick: () => handleNavigation("/E-mail_Caixa_Entrada"),
    },
    {
      key: 'Perfil',
      icon: <RxAvatar />,
      label: 'Perfil',
      onClick: () => handleNavigation("/Perfil"),
    },
    !isRestricted && !isSuperAdmin && {
      key: "logs_empresa",
      icon: <RiContactsBook3Fill />,
      label: "Logs",
      onClick: () => handleNavigation("/logs_empresa"),
    },
    !isRestricted && !isSuperAdmin && {
      key: 'funcionarios',
      icon: <BsPeopleFill />,
      label: "Funcionários",
      children: [
        {
          key: "cadastro_funcionario",
          label: "Cadastrar",
          onClick: () => handleNavigation("/CadastroFuncionario"),
        },
      ]
    },
    !isRestricted && !isSuperAdmin && {
      key: "subestoque",
      icon: <StockOutlined />,
      label: "Estoque",
      children: [
        {
          key: "registrar",
          label: "Registrar produtos",
          onClick: () => handleNavigation("/cad_produto"),
        },
        {
          key: "relatorioestoque",
          label: "Relatório Estoque",
          onClick: () => handleNavigation("/relatorioestoque"),
        },
      ]
    },
    !isRestricted && !isSuperAdmin && {
      key: "financeiro",
      icon: <FaMoneyBillTrendUp />,
      label: "Financeiro",
      children: [
        {
          key: "contaspagar",
          label: "Contas à pagar",
          children: [
            {
              key: "despesas",
              label: "Despesas",
              onClick: () => handleNavigation("/despesas"),
            },
            {
              key: "fornecedores",
              label: "Fornecedores",
              onClick: () => handleNavigation("/fornecedores"),
            },
            {
              key: "pagamentos",
              label: "Pagamentos",
              onClick: () => handleNavigation("/pagamentos"),
            },
          ]
        },
        {
          key: "contasreceber",
          label: "Contas à receber",
          children: [
            {
              key: "fluxo",
              label: "Fluxo de caixa",
              onClick: () => handleNavigation("/fluxodecaixa"),
            },
            {
              key: "receitas",
              label: "Receitas",
              onClick: () => handleNavigation("/receitas"),
            },
          ]
        },
        {
          key: "razao",
          label: "Razão",
          onClick: () => handleNavigation("/razao"),
        },
        {
          key: "relatoriofianc",
          label: "Relatório Financeiro",
          onClick: () => handleNavigation("/relatoriofinanc"),
        },
      ]
    },
    !isRestricted && !isSuperAdmin && {
      key: "vendas",
      icon: <AreaChartOutlined />,
      label: "Vendas",
      children: [
        {
          key: "relatoriovendas",
          label: "Relatório Vendas",
          onClick: () => handleNavigation("/relatoriovendas"),
        },
        {
          key: "cadastronf",
          label: "Notas Fiscais",
          onClick: () => handleNavigation("/cadastronf"),
        },
        {
          key: "clientes",
          label: "Clientes",
          onClick: () => handleNavigation("/clientes"),
        },
        {
          key: "GestaoPedidos",
          label: "Gestão de Pedidos",
          onClick: () => handleNavigation("/gestaoPedidos"),
        },
        {
          key: "PedidosCancelados",
          label: "Pedidos Cancelados",
          onClick: () => handleNavigation("/gestaoPedidosCancelados"),
        },
        {
          key: "historicovendas",
          label: "Histórico de Vendas",
          onClick: () => handleNavigation("/vendas"),
        },
        {
          key: "caixa",
          label: "Caixa",
          onClick: () => handleNavigation("/caixa"),
        }, 
      ]
    },
    {
      key: "Logout",
      icon: <MdLogout />,
      label: "Logout",
      onClick: () => handleNavigation("/logout"),
    },
  ];

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      className="menu-bar"
      items={menuItems.filter(Boolean)}
    />
  );
}

export default MenuList;
