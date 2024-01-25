/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useEventListener,
  useMountEffect,
  useUnmountEffect,
} from "primereact/hooks";
import { classNames, DomHandler } from "primereact/utils";
import React, { useContext, useEffect, useRef } from "react";
import AppFooter from "./AppFooter";
import AppTopbar from "./AppTopbar";
import AppTopSection from "./AppTopSection";
import AppSidebar from "./AppSidebar";
import { LayoutContext } from "./contexto/layoutcontext";
import PrimeReact from "primereact/api";
import SessionContext from "../providers/sessioncontext";
const Layout = (props) => {
  const session = useContext(SessionContext);
  const { layoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);
  const topbarRef = useRef(null);
  const sidebarRef = useRef(null);

  const router = useRouter();
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current.isSameNode(event.target) ||
          sidebarRef.current.contains(event.target) ||
          topbarRef.current.menubutton.isSameNode(event.target) ||
          topbarRef.current.menubutton.contains(event.target)
        );

        if (isOutsideClicked) hideMenu();
      },
    });

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current.topbarOptions.isSameNode(event.target) ||
        topbarRef.current.topbarOptions.contains(event.target) ||
        topbarRef.current.optionsbutton.isSameNode(event.target) ||
        topbarRef.current.optionsbutton.contains(event.target)
      );

      if (isOutsideClicked) hideProfileMenu();
    },
  });
  const [
    bindManageOptionsMenuOutsideClickListener,
    unbindManageOptionsMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current.topbarOptionsAdmin.isSameNode(event.target) ||
        topbarRef.current.topbarOptionsAdmin.contains(event.target) ||
        topbarRef.current.optionsAdminbutton.isSameNode(event.target) ||
        topbarRef.current.optionsAdminbutton.contains(event.target)
      );

      if (isOutsideClicked) hideManageOptions();
    },
  });

  const hideMenu = () => {
    // console.log("click aqui");
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    // console.log("hideProfileMenu");
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };
  const hideManageOptions = () => {
    // console.log("hideManageOptions");
    setLayoutState((prevLayoutState) => ({
      ...prevLayoutState,
      manageOptionsVisible: false,
    }));
    unbindManageOptionsMenuOutsideClickListener();
  };

  const blockBodyScroll = () => {
    DomHandler.addClass("blocked-scroll");
  };

  const unblockBodyScroll = () => {
    DomHandler.removeClass("blocked-scroll");
  };

  useMountEffect(() => {
    PrimeReact.ripple = true;
  });

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    layoutState.staticMenuMobileActive && blockBodyScroll();
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible]);
  useEffect(() => {
    if (layoutState.manageOptionsVisible) {
      bindManageOptionsMenuOutsideClickListener();
    }
  }, [layoutState.manageOptionsVisible]);

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      hideMenu();
      hideProfileMenu();
      hideManageOptions();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  const containerClass = classNames("layout-wrapper layout-overlay", {
    "layout-mobile-active": layoutState.staticMenuMobileActive,
  });

  return (
    <>
      <Head>
        <title>FEDERACIÓN DE ARBITRAJE EC</title>
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:ttl" content="604800"></meta>
        <link rel="icon" href={`/favicon.ico`} type="image/x-icon"></link>
      </Head>
      <div className={containerClass}>
        <AppTopSection />
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className="layout-sidebar">
          <AppSidebar />
        </div>
        <div className="layout-main-container">
          <div className="layout-main">{session && props.children}</div>
        </div>
        {router?.asPath === "/dashboard" && (
          <>
            <div className="layout-banners">
              <div className=".layout-banner-container">
                <div className="layout-banner-dashboard-marketing1" />
                <div className="layout-banner-dashboard-marketing2" />
              </div>
            </div>
          </>
        )}
        <AppFooter />
      </div>
    </>
  );
};

export default Layout;
