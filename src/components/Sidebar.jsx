import React, { useState } from "react";
import { Layout, Button, theme } from "antd";
import MenuList from "./Menulist";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header, Sider } = Layout;
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <aside>
      <Layout>
        <Sider
          collapsed={collapsed}
          trigger={null}
          theme={darkTheme ? "dark" : "light"}
          className="menu"
        >
          <div className="titulo-box">
            <h1 className="titulo">Venturos</h1>
          </div>
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              className="toggle"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
          </Header>
        </Layout>
      </Layout>
    </aside>
  );
}

export default Sidebar;
