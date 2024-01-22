import React, { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import ModalDocumentoPago from "../ModalDocumentoPago";
import { requestValdationToken } from "../../../utils/axios/axios";
const AprobarInscripcion = ({ user, event, onActionApprove, approvingInscription }) => {
    const [showModalDoc, setShowModalDoc] = useState(false);
    const [urlDoc, setUrlDoc] = useState('');
    const [readyToApprove, setReadyToApprove] = useState(false);
    const [idDoc, setIdDoc] = useState(null);
    const showDoc = async (user) => {
        await requestValdationToken(
          `Document/DownloadDocument/${user.id}/${event.id}`
        )
          .then((res) => {
            if (res?.data?.statusCode === 200) {
              setUrlDoc(res.data.result?.url);
              setIdDoc(res.data.result?.id);
              setShowModalDoc(true);
              setReadyToApprove(true);
            }
          })
          .catch((err) => {
            console.error("[*] ========= [*] ERROR Download Document", err);
          });

    }
    useEffect(() => {
        if (!showModalDoc) setUrlDoc('');
    }, [showModalDoc]);
    return (
        <>
            <div className="d-flex justify-content-around">
                <Button label="Ver Documento" icon="pi pi-eye" className="p-button-sm p-button-success p-button-outlined" onClick={() => showDoc(user)} />
                {
                    readyToApprove &&
                    <Button
                        label="Aprobar Inscripción"
                        icon={`pi pi-${approvingInscription ? 'spin pi-spinner' : 'check-circle'}`}
                        className="p-button-sm p-button-raised"
                        onClick={() => onActionApprove({ user, event, idDoc })} />
                }
            </div>
            <ModalDocumentoPago
                event={event}
                user={user}
                url={urlDoc}
                onActionClose={() => {
                    setShowModalDoc(false);
                }}
                visible={showModalDoc}
                setVisible={setShowModalDoc} />
        </>
    );
};

export default AprobarInscripcion;
