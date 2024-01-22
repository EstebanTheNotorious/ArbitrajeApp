import React, { useEffect, useState } from "react";
import ToastConfirm from "../ToastConfirm";
import { Button } from "primereact/button";
const UnsubscribeUserFromEvent = ({
    data,
    onAction
}) => {
    const [showToast, setShowToast] = useState(false);
    const startDeleteEnrollToEvent = () => onAction({ id: data.eventId, idUser: data.userId })
    return (
        <>
            <Button
                tooltip="Anular Inscripción"
                type="button"
                onClick={() => setShowToast(true)}
                icon="pi pi-ban"
                className='p-button-sm p-button-danger' />
            {
                showToast &&
                <ToastConfirm
                    question={`Estás seguro de anular la inscripcion del usuario en el evento ${data.eventName}?`}
                    action={true}
                    actionStart={startDeleteEnrollToEvent}
                    onHide={() => setShowToast(false)}
                />
            }
        </>
    );
};

export default UnsubscribeUserFromEvent;
