import { NextPage } from "next";
import { useContext } from "react";
import { Icon, Menu, MenuItemProps } from "semantic-ui-react";

import { AdminContext } from "../Context";

const adminMenu: NextPage = () => {
  const { active, setActive } = useContext(AdminContext);

  const handleClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps
  ) => void = (_e, { name }) => {
    if (name) setActive(name);
  };

  return (
    <Menu icon="labeled" pointing secondary>
      <Menu.Item name="users" active={active === "users"} onClick={handleClick}>
        <Icon name="user outline" />
        Usuarios
      </Menu.Item>
      <Menu.Item
        name="programs"
        active={active === "programs"}
        onClick={handleClick}
      >
        <Icon name="table" />
        Programas
      </Menu.Item>
    </Menu>
  );
};
export default adminMenu;
