import { useRouter } from "next/router";
import Link from "next/link";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import React, { useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { MenuContext } from "./context/menucontext";

const AppMenuitem = (props) => {
  const { activeMenu, setActiveMenu } = useContext(MenuContext);
  const router = useRouter();
  const item = props.item;
  const key = props.parentKey
    ? props.parentKey + "-" + props.index
    : String(props.index);
  const isActiveRoute = item.to && router.pathname === item.to;
  // const active = activeMenu === key || activeMenu.startsWith(key + "-");
  useEffect(() => {
    if (item.to && router.pathname === item.to) {
      setActiveMenu(key);
    }

    const onRouteChange = (url) => {
      if (item.to && item.to === url) {
        setActiveMenu(key);
      }
    };

    router.events.on("routeChangeComplete", onRouteChange);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemClick = (event) => {
    //avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    //execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // toggle active state
    // if (item.items) setActiveMenu(active ? props.parentKey : key);
    // else setActiveMenu(key);
  };

  const subMenu = item.label === '' && item.items && item.visible !== false && (
    <CSSTransition
      timeout={{ enter: 1000, exit: 450 }}
      classNames="layout-submenu"
      in={props.root ? true : active}
      key={item.label}
    >
      <ul>
        {item.items.map((child, i) => {
          return (
            <AppMenuitem
              item={child}
              index={i}
              className={child.badgeClass}
              parentKey={key}
              key={child.label}
            />
          );
        })}
      </ul>
    </CSSTransition>
  );

  return (
    <>
      {
        item.label !== ''
          ?
          <li
            className={classNames({
              "layout-root-menuitem": props.root,
              // "active-menuitem": active,
            })}
          >
            {/* {props.root && item.visible !== false && (
        <div className="layout-menuitem-root-text">{item.label}</div>
      )} */}
            {
              // item.label !== '' && props.root && item.visible !== false &&
              <Link
                href={item.to}
                replace={item.replaceUrl}
                target={item.target}
                onClick={(e) => itemClick(e)}
                /* className={classNames(item.class, "p-ripple", {
                  "active-route": isActiveRoute,
                })} */
                tabIndex={0}
              >
                <span className="layout-menuitem-text">{item.label}</span>
                <Ripple />
              </Link>
            }
            {/* {
        item.label === '' && item.visible !== false &&
        subMenu
      } */}

            {/* {item.to && !item.items && item.visible !== false ? ( */}
            {/* {item.to && !item.items && item.visible !== false ? ( */}
          </li>
          :
          <>
            {/* {item.items?.length && <p>{JSON.stringify(item.items)}</p>} */}
            {
              item.items.map((item, index) => (
                <li key={index}
                  className={classNames({
                    "layout-root-menuitem": props.root,
                    // "active-menuitem": active,
                  })}
                >
                  <Link
                    href={item.to}
                    replace={item.replaceUrl}
                    target={item.target}
                    onClick={(e) => itemClick(e)}
                    /* className={classNames(item.class, "p-ripple", {
                      "active-route": isActiveRoute,
                    })} */
                    tabIndex={0}
                  >
                    <span className="layout-menuitem-text">{item.label}</span>
                    <Ripple />
                  </Link>
                </li>

              ))
            }
          </>
      }
    </>
  );
};

export default AppMenuitem;
