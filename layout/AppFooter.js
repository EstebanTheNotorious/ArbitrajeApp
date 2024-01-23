import React, { useContext, useState } from "react";
import { LayoutContext } from "./contexto/layoutcontext";
import { Button } from "primereact/button";
import ModalAuth from "../components/auth/ModalAuth";

const AppFooter = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [showModalAuth, setShowModalAuth] = useState(false);
  const startAuth = () => setShowModalAuth(true);
  return (
    <>
      <div className="layout-footer">
        <div className="text-700 text-center p-7">
          <picture>
            <img
              // src='/layout/images/aname-logo-footer.svg'
              src="/layout/images/logo.svg"
              alt="LOGO ANAME"
              height="150"
            />
          </picture>
          {/* <div className="text-blue-600 font-bold mb-3"><i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div> */}
          <div className="text-900 font-bold xl:text-3xl lg:text-2xl md:text-lg sm:text-base mt-3">
            FEDERACION DE ARBITRAJE
          </div>
          <div className="text-700 xl:text-2xl lg:text-xl md:text-base sm:text-sm mb-3">
            Sucríbete y recibe las noticias más destacadas del arbitraje a nivel
            nacional.
          </div>
          <Button
            label="Suscribete"
            icon="pi pi-thumbs-up-fill"
            className="font-bold mx-2 py-2 p-button-raised p-button-rounded white-space-nowrap"
            onClick={startAuth}
          />
        </div>
      </div>
      <ModalAuth
        action="login"
        visible={showModalAuth}
        setVisible={setShowModalAuth}
      />
    </>
  );
};

export default AppFooter;
