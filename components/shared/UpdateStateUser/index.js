import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
const UpdateStateUser = ({
    data, onAction
}) => {
    const toast = useRef(null);
    // const toastBC = useRef(null);

    const beginUpdateState = (value) => {
        if (value === 1) onAction({ email: data.email, state: data.state });
        else onAction({ email: data.email, isFederated: data.isFederated })
    }
    /* const clear = (submit) => {
        toastBC.current.clear();
        if (submit) {
            show();
            actionLogout();
        } else actionCancel();
    }; */

    /* const show = () => {
        toast.current.show({
            severity: "info",
            summary: summary,
            detail: "",
        });
    }; */

    const confirm = (value) => {
        toast.current.show({
            severity: 'info',
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
                        {
                            value === 1 ?
                                <div className="font-bold text-xl my-3">Estás seguro de {data.state === 1 ? 'inhabilitar' : 'habilitar'} al usuario {data.firstName + " " + data.lastName}?</div>
                                :
                                <div className="font-bold text-xl my-3">Estás seguro de {data.isFederated === 1 ? 'afiliar' : 'desafiliar'} al usuario {data.firstName + " " + data.lastName}?</div>
                        }
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                toast.current.clear();
                                beginUpdateState(value);
                            }}
                            type="button"
                            label="Confirmar"
                            className="customButtonConfirmLogout p-button-sm p-button-rounded p-button-raised w-full"
                        />
                        <Button
                            onClick={(e) => toast.current.clear()}
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
                position="top-center"
            />
            {/* <Toast
                ref={toastBC}
                position="top-center"
                className="toastCustomLogout"
                onHide={actionCancel}
            /> */}
            {
                data.state === 2
                    ?
                    <Button icon="pi pi-check" tooltip="Habilitar" className='p-button-sm p-button-rounded p-button-outlined' aria-label="Enable" onClick={() => confirm(1)} />
                    :
                    <Button icon="pi pi-times" tooltip="Deshabilitar" className='p-button-sm p-button-rounded p-button-outlined p-button-danger' aria-label="Disable" onClick={() => confirm(1)} />

            }
            {
                data.isFederated === 1
                    ?
                    <Button icon="pi pi-user-plus" tooltip="Hacer al usuario Federado" className='p-button-sm p-button-rounded p-button-success ml-2' aria-label="Enable" onClick={() => confirm(2)} />
                    :
                    <Button icon="pi pi-user-minus" tooltip="Quitar al usuario como Federado" className='p-button-sm p-button-rounded p-button-secondary ml-2' aria-label="Disable" onClick={() => confirm(2)} />

            }

        </>
    );
};

export default UpdateStateUser;
