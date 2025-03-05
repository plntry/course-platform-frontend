import { PATHS } from "../../routes/paths";
import type { MenuProps } from "antd";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "./Header.module.css";

export type MenuItem = Required<MenuProps>["items"][number];

type UserAvailableHeaderTabs = {
  [role: string]: MenuItem[];
};

export const headerTabs: UserAvailableHeaderTabs = {
  student: [
    {
      key: PATHS.HOME,
      label: "Home",
      icon: <HomeOutlined />,
    },
    {
      key: PATHS.LOGOUT,
      label: "Log out",
      icon: <LogoutOutlined />,
      className: classes.menuLogoutItem,
    },
  ],
};
