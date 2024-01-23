import Link from "next/link";
// import { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Messages } from "primereact/messages";
import { LayoutContext } from "./contexto/layoutcontext";
import AppDropdownMenu from "./AppDropdownMenu";
import { menuData } from "./MenuData";
import ModalAuth from "../components/auth/ModalAuth";
import ModalEdit from "../components/editUserData/modalEdit";
import { Tooltip } from "primereact/tooltip";
import { BubbleContext } from "../providers/bubblecontext";
import SessionContext from "../providers/sessioncontext";
import ToastConfirmLogout from "../components/shared/ToastConfirmLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faRightFromBracket,
  faEllipsis,
  faUser,
  faToolbox
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useRouter } from "next/router";
import { TopBarData, TopBarUserOptionData } from "./topBarData";
import ability from "../authorization/defineAbility";
// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((props, ref) => {
  const router = useRouter();
  const { session, setSession, verifySessionToken } =
    useContext(SessionContext);
  const { showBubbleProfile, setShowBubbleProfile } = useContext(BubbleContext);
  const { layoutState, onMenuToggle, showProfileSidebar, showManageOptions } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarOptionsRef = useRef(null);
  const topbarOptionsAdminRef = useRef(null);
  const optionsbuttonRef = useRef(null);
  const optionsAdminbuttonRef = useRef(null);

  const [sticky, setSticky] = useState({ isSticky: false });
  const topbarRef = useRef(null);

  // const rol = localStorage.getItem('rolId');

  const handleScroll = () => {
    window.scrollY > 88
      ? setSticky({ isSticky: true })
      : setSticky({ isSticky: false });
  };

  const [showModalAuth, setShowModalAuth] = useState(false);
  const [showModalEditDataUser, setShowModalEditDataUser] = useState(false);

  const msgBubbleUpdateDataUser = useRef(null);
  const msgUpdateDataUserAfterFirsLogin =
    "Debes actualizar los datos de tu cuenta para poderte inscribir en cualquier competencia";

  const [startLogout, setStartLogout] = useState(false);

  useEffect(() => {
    // console.log("local storage en topbar", localStorage);
    // localStorage.clear();
    const handleScrollEvent = () => handleScroll();
    window.addEventListener("scroll", handleScrollEvent);
    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* useEffect(() => {
    const el = document.getElementById("logo-Aname");
    const checkAndAddClass = () => {
      if (localStorage.getItem("token"))
        el.classList.add("layout-topbar-logo-mleft");
      else el.classList.remove("layout-topbar-logo-mleft");
    };
    checkAndAddClass();
    window.addEventListener("storage", checkAndAddClass);
    return () => {
      window.removeEventListener("storage", checkAndAddClass);
    };
  }, []); */

  useEffect(() => {
    if (showBubbleProfile) {
      msgBubbleUpdateDataUser.current?.show([
        {
          sticky: true,
          severity: "info",
          summary: "Datos de la cuenta",
          detail: msgUpdateDataUserAfterFirsLogin,
        },
      ]);
    }
  }, [showBubbleProfile]);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarOptions: topbarOptionsRef.current,
    topbarOptionsAdmin: topbarOptionsAdminRef.current,
    optionsbutton: optionsbuttonRef.current,
    optionsAdminbutton: optionsAdminbuttonRef.current,
  }));
  const logout = async () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    /* await router.push('/dashboard');
    setSession(null);
    router.reload(); */
    verifySessionToken();
  };
  const startAuth = () => setShowModalAuth(true);
  return (
    <div
      className={`layout-topbar${sticky.isSticky ? " animated-bar" : ""}`}
      ref={topbarRef}
    >
      <div className="container-topbar">
        <Link href="/" id="logo-Aname" className="layout-topbar-logo">
          <img
            // src="/layout/images/logo-aname.svg"
            src="/layout/images/AnameLogo.svg"
            width="227px"
            // width="227px"
            alt="ANAME LOGO"
          />
        </Link>
        <ul className="layout-topbar-menu">
          {menuData.map((item, index) => (
            <li className="p-link layout-topbar-menu-item" key={index}>
              {item.label !== "" ? (
                <span>{item.label}</span>
              ) : (
                <FontAwesomeIcon
                  icon={faEllipsis}
                  style={{ fontSize: "1.5rem" }}
                />
              )}
              <i className="pi pi-angle-down item-icon-down"></i>
              <i className="pi pi-angle-up item-icon-up"></i>
              <AppDropdownMenu
                modo={item.label !== "" ? "simple" : "wrap"}
                options={item.items}
              />
            </li>
          ))}
        </ul>
        <button
          ref={menubuttonRef}
          type="button"
          className="p-link layout-menu-button layout-topbar-button"
          onClick={onMenuToggle}
        >
          <i className="pi pi-bars" />
        </button>
        {session && (
          <button
            ref={optionsbuttonRef}
            type="button"
            className="p-link layout-options-button layout-topbar-button"
            onClick={showProfileSidebar}
          >
            <i className="pi pi-ellipsis-v" />
          </button>
        )}
        <ul
          ref={topbarOptionsRef}
          className={classNames("layout-topbar-options", {
            "layout-topbar-options-mobile-active":
              layoutState.profileSidebarVisible,
          })}
        >
          {session && (
            <>
              {TopBarData.map((el, i) => (
                <>
                  {ability.can(el.code, localStorage?.getItem("rolId")) &&
                    (el.code !== "PERFIL-USUARIO" ? (
                      <div key={i}>
                        <Tooltip target={`.li-${el.label.toLowerCase()}`} />
                        <Link href={el.to}>
                          <li
                            type="button"
                            className={`li-${el.label.toLowerCase()} layout-topbar-button`}
                            data-pr-tooltip={el.label}
                            data-pr-position="bottom"
                            style={{ cursor: "pointer", position: "relative" }}
                          >
                            {el.icon}
                            <span>{el.label}</span>
                          </li>
                        </Link>
                      </div>
                    ) : (
                      <div key={i}>
                        <Tooltip target={`.li-perfil-usuario`} />
                        <li
                          type="button"
                          className={`li-perfil-usuario layout-topbar-button ${
                            showBubbleProfile &&
                            "active-layout-topbar-button-tutorial"
                          }`}
                          data-pr-tooltip={el.label}
                          data-pr-position="bottom"
                          style={{ cursor: "pointer", position: "relative" }}
                          onClick={(e) => setShowModalEditDataUser(true)}
                        >
                          {el.icon}
                          <span>{el.label}</span>
                        </li>
                      </div>
                    ))}
                </>
              ))}
              {showBubbleProfile && (
                <Messages
                  ref={msgBubbleUpdateDataUser}
                  onRemove={() => setShowBubbleProfile(false)}
                  className="customMessages"
                />
              )}
            </>
          )}

          {/* <li type="button" className="layout-topbar-button">
            <i className="pi pi-home"></i>
            <span>Perfil</span>
          </li>

          <li type="button" className="layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Ajustes</span>
          </li> */}
        </ul>
        <Tooltip target=".button-manage" />
        <button
          ref={optionsAdminbuttonRef}
          type="button"
          className="button-manage p-link layout-options-user-button layout-topbar-button"
          data-pr-tooltip="Usuario"
          data-pr-position="bottom"
          onClick={showManageOptions}
          style={{ height: "45px" }}
        >
          <i className="pi pi-user" />
        </button>
        <ul
          ref={topbarOptionsAdminRef}
          className={classNames("layout-topbar-manage-options", {
            "layout-topbar-options-mobile-active":
              layoutState.manageOptionsVisible,
          })}
        >
          {!session ? (
            <>
              <Tooltip target=".li-login" />
              <li
                type="button"
                className="li-login layout-topbar-manege-option-button"
                onClick={startAuth}
                data-pr-tooltip="Iniciar Sesión"
                data-pr-position="bottom"
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className="iconFontAwesome"
                />
                <span>Entrar</span>
              </li>
            </>
          ) : (
            <>
              <NameUserContainer>
                <FontAwesomeIcon icon={faUser} className="iconFontAwesome" />
                <span>{localStorage?.getItem("user")}</span>
              </NameUserContainer>
              {TopBarUserOptionData.map((el, i) => (
                <>
                  {ability.can(el.code, localStorage?.getItem("rolId")) && (
                    <div key={i}>
                      <Tooltip target={`.li-${el.label.toLowerCase()}`} />
                      <Link href={el.to}>
                        <li
                          type="button"
                          className={`li-${el.label.toLowerCase()} layout-topbar-manege-option-button`}
                          data-pr-tooltip={el.label}
                          data-pr-position="bottom"
                          style={{ cursor: "pointer", position: "relative" }}
                        >
                          <FontAwesomeIcon icon={faToolbox} />
                          <span>{el.label}</span>
                        </li>
                      </Link>
                    </div>
                  )}
                </>
              ))}
              <Tooltip target=".li-logout" />
              <li
                type="button"
                className="li-logout layout-topbar-manege-option-button"
                data-pr-tooltip="Cerrar Sesion"
                data-pr-position="bottom"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={(e) => setStartLogout(true)}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Cerrar Sesion</span>
              </li>
            </>
          )}
        </ul>
      </div>
      <ModalAuth
        action="login"
        visible={showModalAuth}
        setVisible={setShowModalAuth}
      />
      <ModalEdit
        visible={showModalEditDataUser}
        setVisible={setShowModalEditDataUser}
      />
      <ToastConfirmLogout
        question="Vas a cerrar sesion"
        severity="info"
        // summary="Sesion terminada"
        summary="Sesion terminada"
        action={startLogout}
        actionCancel={() => setStartLogout(false)}
        actionLogout={(e) => {
          setStartLogout(false);
          logout();
        }}
      />
    </div>
  );
});

export default AppTopbar;

const NameUserContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  /* background: var(--surface-primary-alfa); */
  color: var(--primary-color);
  padding: 0.5rem;
  align-items: center;
  border-bottom: 2px solid var(--primary-color);

  .svg-inline--fa {
    width: 2.75rem;
  }

  span {
    font-weight: bold;
    display: block;
  }
`;
