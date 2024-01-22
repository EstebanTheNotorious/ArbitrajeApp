import { useState } from "react";

const AppDropdownMenu = ({ modo, options }) => {
  return (
    <ul className={modo === 'wrap' ? "dropdown-menu" : "dropdown-menu-simple"}>
      {options.map((option, index) => (
        <li key={index}>
          <span>{option.label}</span>
          {/* {option.items?.length &&
            <>
              <hr style={{margin: '0'}}/>
              <ul className="dropdown-submenu">
                {
                  option.items.map((item, index) => (
                    <li key={index}>
                      <i className={`${item.icon} mr-2`} />
                      {item.label}
                    </li>
                  ))
                }
              </ul>
            </>} */}
        </li>
      ))}
    </ul>
  );
};

export default AppDropdownMenu;
