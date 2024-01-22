import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
// import { Toast } from "primereact/toast";
import { styled } from "styled-components";
import { Card } from "primereact/card";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import CreateEditEvent from "../CreateEditEvent";
import styles from "./index.module.scss";
import ToastConfirm from "../ToastConfirm";
const Competencia = ({ data }) => {
  /* const [showModalEditar, setShowModalEditar] = useState(false);
    const [showToastDelete, setShowToastDelete] = useState(false); */

  /* useEffect(() => {
        if (data) {
            console.log('data card', data)
        }
    }, [data]); */

  const header = (
    <picture>
      <img
        alt="Card"
        src="https://primefaces.org/cdn/primereact/images/usercard.png"
      />
    </picture>
  );
  /* const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Editar" icon="pi pi-pencil" onClick={() => setShowModalEditar(true)} className="p-button-sm p-button-raised" />
            <Button label="Eliminar" icon="pi pi-trash" onClick={() => setShowToastDelete(true)} className="p-button-sm p-button-outlined p-button-danger" />
        </div>
    ); */

  /* const sendAction = (criterio) => {
        onAction({ action: criterio, element: data });
    } */
  /* const startEdit = (e) => onAction(e);
    const startDelete = () => onActionDelete({id: data.id}); */
  const dataDateEvent = () => (
    <ContainerTime>
      <p className="mb-0 text-right">
        <span className="bg-red-100 border-round px-2">
          Desde: {moment(data.eventStartDate).format("DD-MM-YYYY")}
        </span>
      </p>
      <p className="mb-0 text-right">
        <span className="bg-red-100 border-round px-2">
          Hasta: {moment(data.eventEndDate).format("DD-MM-YYYY")}
        </span>
      </p>
      {data.genderAllow !== "4" && (
        <p className="mb-0 text-right">
          <span className="bg-blue-100 border-round px-2">
            SOLO PARA: <b>{data.genderAllow === "1" ? "HOMBRES" : "MUJERES"}</b>
          </span>
        </p>
      )}
      <p className="mb-0 text-right font-bold">
        Horario: {data.eventHourStart.replace(":00", "")}
      </p>
    </ContainerTime>
  );
  return (
    <>
      {data && (
        <>
          <Card
            title={data.competenceName}
            /* subTitle={dataDateEvent} */ className="w-full mb-3"
          >
            {/* <p className="m-0">{data.eventDescription}</p> */}
            <hr />
            <ContainerInfo>
              {/* <span className="text-right"><b>Tipo de Evento: </b>{data.eventType.eventTypeName}</span> */}
              {/* <span className="text-right"><b>Tipo de Prueba: </b>{data.proof.proofName}</span> */}
            </ContainerInfo>
          </Card>

          {/* <Dialog
                        header={`Editar Evento ${data.eventName}`}
                        visible={showModalEditar}
                        className={`${styles.widthModalEditar}`}
                        onHide={() => setShowModalEditar(false)}>
                        <div className="row justify-content-center align-items-center">
                            <div className="col-12">
                                <CreateEditEvent data={data} criterio={'Editar'} onAction={startEdit} />
                            </div>
                        </div>
                    </Dialog> */}
          {/* {
                        showToastDelete &&
                        <ToastConfirm
                            question={`Estás seguro de borrar la competencia ${data.competenceName}?`}
                            action={true}
                            actionStart={startDelete}
                            onHide={() => setShowToastDelete(false)}
                        />
                    } */}
        </>
      )}
    </>
  );
};

export default Competencia;
const ContainerTime = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  color: var(--secondary-color);
  font-weight: 500;
`;
const ContainerInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-inline: 0.5rem;
`;
