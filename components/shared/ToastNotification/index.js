import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
const ToastNotification = ({
  summary,
  detail,
  onActionClose,
  isTokenExpired = false
}) => {
  const toast = useRef(null);

  useEffect(() => {
    show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const show = () => {
    toast.current.show({
      severity: !isTokenExpired ? 'info' : 'error',
      summary: summary,
      detail: detail,
    });
  };



  return (
    <>
      <Toast
        ref={toast}
        className={`${!isTokenExpired ? 'toastCustomConfirmLogout' : ''}`}
        position={`${!isTokenExpired ? 'top-right' : 'top-center'}`}
        onHide={onActionClose}
      />
      {/* <Button type="button" onClick={confirm} label="Submit" /> */}
    </>
  );
};

export default ToastNotification;
