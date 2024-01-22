import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import styles from "./index.module.scss";
const ToastConfirmLogout = ({
  question,
  severity,
  summary,
  // detail,
  action,
  actionCancel,
  actionLogout,
}) => {
  const toast = useRef(null);
  const toastBC = useRef(null);

  useEffect(() => {
    if (action) confirm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const clear = (submit) => {
    toastBC.current.clear();
    if (submit) {
      show();
      actionLogout();
    } else actionCancel();
  };

  const show = () => {
    toast.current.show({
      severity: "info",
      summary: summary,
      detail: "",
    });
  };

  const confirm = () => {
    toastBC.current.show({
      severity: severity,
      sticky: true,
      className: "border-none",
      content: (
        <div
          className="flex flex-column align-items-center"
          style={{ flex: "1" }}
        >
          <div className="text-center">
            <i
              className="pi pi-exclamation-triangle"
              style={{ fontSize: "3rem" }}
            ></i>
            <div className="font-bold text-xl my-3">{question}</div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={(e) => clear(true)}
              type="button"
              label="Confirmar"
              className="customButtonConfirmLogout p-button-sm p-button-rounded p-button-raised w-full"
            />
            <Button
              onClick={(e) => clear(false)}
              type="button"
              label="Cancelar"
              className="customButtonCancelLogout p-button-sm p-button-rounded p-button-raised w-full"
            />
          </div>
        </div>
      ),
    });
  };

  return (
    <>
      <Toast
        ref={toast}
        className="toastCustomConfirmLogout"
        position="bottom-right"
      />
      <Toast
        ref={toastBC}
        position="top-center"
        className="toastCustomLogout"
        onHide={actionCancel}
      />
      {/* <Button type="button" onClick={confirm} label="Submit" /> */}
    </>
  );
};

export default ToastConfirmLogout;
