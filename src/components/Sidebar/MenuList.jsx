import React, { useState } from "react";
import { Menu } from "antd";
import {
  StockOutlined,
  AreaChartOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { MdLogout, MdOutlineMailOutline } from "react-icons/md";
import { IoPieChartSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { RiContactsBook3Fill } from "react-icons/ri";
import { BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const MenuList = ({ darkTheme }) => {
  return (
    <Menu theme={darkTheme ? "dark" : "light"} className="SideBar-Menu-Bar">
      <Menu.Item key="dashboard" icon={<IoPieChartSharp />}>
        Dashboard
      </Menu.Item>
      <Menu.Item key="email" icon={<MdOutlineMailOutline />}>
        E-mail
      </Menu.Item>
      <Menu.Item key="perfil" icon={<RxAvatar />}>
        Perfil
      </Menu.Item>
      <Menu.Item key="logs" icon={<RiContactsBook3Fill />}>
        Logs
      </Menu.Item>

      <Menu.SubMenu
        key="funcionario"
        icon={<BsPeopleFill />}
        title="Funcionários"
      >
        <Menu.Item key="cad_funcionario">Cadastrar Funcionários</Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="estoque" icon={<StockOutlined />} title="Estoque">
        <Menu.Item key="reg_produto">Registrar Produto</Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="financeiro"
        icon={<FaMoneyBillTrendUp />}
        title="Financeiro"
      >
        <Menu.SubMenu key="contas_a_pagar" title="Contas à pagar">
          <Menu.Item key="despesas">Despesas</Menu.Item>
          <Menu.Item key="fornecedores">Fornecedores</Menu.Item>
          <Menu.Item key="pagamentos">Pagamentos</Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="contas_a_receber" title="Contas à receber">
          <Menu.Item key="fluxo_de_caixa">Fluxo de caixa</Menu.Item>
          <Menu.Item key="receitas">Receitas</Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="plano_conta" title="Plano conta">
          <Menu.Item key="planos">Planos</Menu.Item>
          <Menu.Item key="lancamento">Lançamento contábil</Menu.Item>
          <Menu.Item key="balancete">Balancete</Menu.Item>
          <Menu.Item key="dre">DRE</Menu.Item>
          <Menu.Item key="razao">Razão</Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="imposto" title="Imposto">
          <Menu.Item key="cad_imposto">Cadastrar Imposto</Menu.Item>
        </Menu.SubMenu>
      </Menu.SubMenu>

      <Menu.SubMenu key="vendas" icon={<AreaChartOutlined />} title="Vendas">
        <Menu.Item key="notas_fiscais">Notas Fiscais</Menu.Item>
        <Menu.Item key="clientes">Clientes</Menu.Item>
        <Menu.Item key="gestao_de_pedidos">Gestão de pedidos</Menu.Item>
        <Menu.Item key="pedidos_cancelados">Pedidos cancelados</Menu.Item>
        <Menu.Item key="historico_de_vendas">Histórico de vendas</Menu.Item>
        <Menu.Item key="caixa">Caixa</Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="logout" icon={<MdLogout />}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
