import React, { useContext } from "react";
import AppMenuitem from "./AppMenuItem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { Button } from "primereact/button";
// import Link from "next/link";
import { menuData } from "./MenuData";

const AppMenu = () => {
  const { onMenuToggle } = useContext(LayoutContext);

  return (
    <MenuProvider>
      <div className="d-flex justify-content-end p-3">
        <Button
          icon="pi pi-times"
          rounded
          // text
          aria-label=""
          className="font-bold custom-button-close-sidebar p-button-danger p-button-rounded white-space-nowrap"
          onClick={onMenuToggle}
        />
      </div>
      <ul className="layout-menu">
        {menuData.map((item, i) => {
          return (
            !item.seperator && (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            )
          );
          // ) : (
          // <li className="menu-separator"></li>
          // );
        })}
      </ul>
      <div className="footer-sidebar">
        <img
          src="/layout/images/AnameLogo.svg"
          width="100%"
          alt="ANAME LOGO"
        />
      </div>
    </MenuProvider>
  );
};

export default AppMenu;
