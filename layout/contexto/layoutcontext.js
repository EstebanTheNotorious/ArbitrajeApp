import React, { useState } from "react";
export const LayoutContext = React.createContext();
// import { requestValdationToken } from '../../utils/axios';
// import { SessionProvider } from '../../permissions/context/sessioncontext';

export const LayoutProvider = (props) => {
  const [layoutState, setLayoutState] = useState({
    overlayMenuActive: false,
    profileSidebarVisible: false,
    manageOptionsVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  const onMenuToggle = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
    }));
  };
  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }));
  };
  const showManageOptions = () => {
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      manageOptionsVisible: !prevLayoutState.manageOptionsVisible,
    }));
  };

  /* const isOverlay = () => {
    return layoutConfig.menuMode === "overlay";
  };

  const isDesktop = () => {
    return window.innerWidth > 991;
  }; */

  const value = {
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
    showManageOptions
  };

  return (
    // <SessionProvider>
    <LayoutContext.Provider value={value}>
      {props.children}
    </LayoutContext.Provider>
    // </SessionProvider>
  );
};
