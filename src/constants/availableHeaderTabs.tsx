import { PATHS, ROLE_PATHS } from "../routes/paths";
import type { MenuProps } from "antd";
import { HomeOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "../components/Header/Header.module.css";
import { GUEST_ROLE } from "../models/User";

export type MenuItem = Required<MenuProps>["items"][number];

type UserAvailableHeaderTabs = {
  [role: string]: MenuItem[];
};

const headerTabs = [
  {
    key: PATHS.HOME.link,
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: PATHS.COURSES.link,
    label: "All Courses",
  },
  {
    key: PATHS.LOGOUT.link,
    label: "Log out",
    icon: <LogoutOutlined />,
    className: classes.menuLastItem,
  },
  {
    key: PATHS.AUTH.link,
    label: "Login",
    icon: <LoginOutlined />,
    className: classes.menuLastItem,
  },
];

export const availableHeaderTabs: UserAvailableHeaderTabs = {};

for (const role in ROLE_PATHS) {
  const paths = ROLE_PATHS[role];
  const tabs = headerTabs.filter((tab) => {
    if (role === GUEST_ROLE) {
    }

    return paths.includes(tab.key);
  });

  availableHeaderTabs[role] = tabs;
}
