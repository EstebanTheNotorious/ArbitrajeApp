import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import styles from "./index.module.scss";
import styled from "styled-components";
import { Button } from "primereact/button";

const ModalDocumentoPago = ({ event, user, url, visible, setVisible }) => {
  const headerDialog = () => (
    <>
      <p className="mb-0">
        Comprobante de Pago {user.firstName} {user.lastName}
      </p>
      <p className="mb-0">{event.eventName}</p>
    </>
  );
  const footerDialog = () => (
    <Button
      label="Cerrar"
      type="button"
      className="p-button-sm p-button-secondary p-button-raised"
      onClick={() => setVisible(false)}
    />
  );

  return (
    <>
      {user && event && url && (
        <Dialog
          header={headerDialog}
          footer={footerDialog}
          visible={visible}
          className={`${styles.widthModalDocPago}`}
          onHide={() => setVisible(false)}
          pt={{
            header: { className: "bg-blue-900 text-0 p-3" },
          }}
        >
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              {/* <h4>{event.eventName}</h4> */}
              <Card>
                <picture>
                  <img src={url} alt="Preview" width="500" />
                </picture>
              </Card>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ModalDocumentoPago;

const HeaderComprobantePago = styled.div`
  display: inline-block;
`;
