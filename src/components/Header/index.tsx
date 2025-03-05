import React from "react";
import { Link, useNavigate, useSubmit, useLocation } from "react-router";
import { PATHS } from "../../routes/paths";
import { Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "./Header.module.css";
import logo from "../../assets/logo.png";
import { headerTabs } from "./headerTabs";
import { MenuItem } from "./headerTabs";
import { useAuthStore } from "../../store/useAuthStore";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const role = useAuthStore((state) => state.user?.role) || "student";
  console.log({ role });

  const menuItems: MenuItem[] = headerTabs[role];

  const selectedKey =
    location.pathname.startsWith("/") && location.pathname !== PATHS.HOME
      ? location.pathname.substring(1)
      : location.pathname;

  const handleMenuItemClick = ({ key }: { key: string }) => {
    if (key === PATHS.LOGOUT) {
      submit(null, { action: PATHS.LOGOUT, method: "POST" });
    } else if (key) {
      navigate(key);
    }
  };

  return (
    <AntHeader
      className={classes.header}
      style={{ background: colorBgContainer }}
    >
      <Link to={PATHS.HOME} className={classes.logoWrapper}>
        <img src={logo} className={classes.logo} alt="Logo" />
      </Link>
      <Menu
        className={classes.menu}
        mode="horizontal"
        items={menuItems}
        selectedKeys={[selectedKey]}
        onClick={handleMenuItemClick}
      />
    </AntHeader>
  );
};

export default Header;

const normalizePath = (path: string) => path.replace(/^\/+/, "");
