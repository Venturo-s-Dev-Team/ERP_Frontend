import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { StockOutlined, AreaChartOutlined } from "@ant-design/icons";
import { MdLogout, MdOutlineMailOutline } from "react-icons/md";
import { IoPieChartSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { RiContactsBook3Fill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });

        if (typeof response.data.token === "string") {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error("Token não é uma string:", response.data.token);
          navigate("/login");
        }
      } catch (error) {
        console.error("Token inválido", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path, {
      state: {
        userName: userInfo.Nome_user,
        userId: userInfo.id_user,
        id_EmpresaDb: userInfo.id_EmpresaDb,
      },
    });
  };

  const items = [
    {
      key: "dashboard",
      icon: <IoPieChartSharp />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "email",
      icon: <MdOutlineMailOutline />,
      label: <Link to="/email_entrada">Email</Link>,
    },
    {
      key: "perfil",
      icon: <RxAvatar />,
      label: <Link to="/perfil_user">Perfil</Link>,
    },
    {
      key: "logs",
      icon: <RiContactsBook3Fill />,
      label: "Logs",
    },
    {
      key: "funcionario",
      icon: <BsPeopleFill />,
      label: "Funcionários",
      children: [
        {
          key: "cad_funcionario",
          label: <Link to="/funcionarios"> Cadastrar Funcionários </Link>,
        },
      ],
    },
    {
      key: "estoque",
      icon: <StockOutlined />,
      label: "Estoque",
      children: [
        {
          key: "reg_produto",
          label: <Link to="/cad_produtos"> Registrar Produto</Link>,
        },
      ],
    },
    {
      key: "financeiro",
      icon: <FaMoneyBillTrendUp />,
      label: "Financeiro",
      children: [
        {
          key: "contas_a_pagar",
          label: "Contas à pagar",
          children: [
            { key: "despesas", label: <Link to="/despesas"> Despesas </Link> },
            {
              key: "fornecedores",
              label: <Link to="/fornecedores"> Fornecedores </Link>,
            },
            {
              key: "pagamentos",
              label: <Link to="/pagamentos"> Pagamentos</Link>,
            },
          ],
        },
        {
          key: "contas_a_receber",
          label: "Contas à receber",
          children: [
            {
              key: "fluxo_de_caixa",
              label: <Link to="/fluxoCaixa"> Fluxo de Caixa</Link>,
            },
            { key: "receitas", label: <Link to="/receitas"> Receitas </Link> },
          ],
        },
        {
          key: "plano_conta",
          label: "Plano conta",
          children: [
            { key: "planos", label: <Link>Planos</Link> },
            {
              key: "lancamento",
              label: <Link to="/lancontabil"> Lançamento Contábil </Link>,
            },
            { key: "balancete", label: <Link to="/balancete">Balancete</Link> },
            { key: "dre", label: <Link to="/dre"> DRE</Link> },
            { key: "razao", label: <Link to="/razao">Razão</Link> },
          ],
        },
        {
          key: "imposto",
          label: "Imposto",
          children: [{ key: "cad_imposto", label: "Cadastrar Imposto" }],
        },
      ],
    },
    {
      key: "vendas",
      icon: <AreaChartOutlined />,
      label: "Vendas",
      children: [
        {
          key: "notas_fiscais",
          label: <Link to="/notafiscal">Notas Fiscais</Link>,
        },
        { key: "clientes", label: <Link to="/clientes"> Clientes </Link> },
        {
          key: "gestao_de_pedidos",
          label: <Link to="/gestaoVendas"> Gestão de Pedidos </Link>,
        },
        {
          key: "pedidos_cancelados",
          label: <Link to="/pedidoscancelados"> Pedidos Cancelado </Link>,
        },
        { key: "historico_de_vendas", label: <Link>Histórico de Vendas</Link> },
        { key: "caixa", label: <Link to="/caixa_Modal"> Caixa </Link> },
      ],
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
      className="SideBar-Menu-Bar"
      items={items}
    />
  );
};

export default MenuList;
