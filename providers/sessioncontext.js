import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { verifySession } from "../utils/axios/axios";
import ToastNotification from "../components/shared/ToastNotification";
const SessionContext = React.createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null); // Estado de la sesión
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    verifySessionToken();
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const verifySessionToken = async () => {
    // setSession(localStorage.getItem('token'))
    // console.log('========> debugueando ......')
    try {
      await verifySession("Utils/verify-token").then((res) => {
        if (res?.data?.statusCode === 200 && res?.data?.result) {
          setSession(res.data.result);
        } else {
          if (localStorage.length !== 0) setShowToast(true);
          setTimeout(async () => {
            setSession(null);
            if (router.asPath !== "/dashboard") await router.push("/dashboard");
            localStorage.clear();
            // if (router.asPath !== '/dashboard') router.reload();
          }, 1000);
        }
      });
    } catch (error) {
      console.error(
        "[*] ============ [*] ERROR VERIFICANDO TOKEN DE SESION ",
        error
      );
    }
  };
  const value = {
    session,
    setSession,
    verifySessionToken,
  };

  return (
    <>
      {showToast && (
        <ToastNotification
          summary={"CADUCÓ LA SESIÓN"}
          detail={"Inicia sesión nuevamente"}
          onActionClose={() => setShowToast(false)}
          isTokenExpired={true}
        />
      )}
      <SessionContext.Provider value={value}>
        {children}
      </SessionContext.Provider>
    </>
  );
};

export default SessionContext;
