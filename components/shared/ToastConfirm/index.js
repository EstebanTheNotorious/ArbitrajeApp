import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
const ToastConfirm = ({
    question,
    action,
    actionStart,
    onHide
}) => {
    const toast = useRef(null);

    useEffect(() => {
        if (action) show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    const confirm = () => {
        toast.current.clear();
        // show();
        actionStart();
    };

    const show = () => {
        toast.current.show({
            // severity: 'info',
            sticky: true,
            // className: "border-none",
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
                            onClick={confirm}
                            type="button"
                            label="Confirmar"
                            className="customButtonConfirmLogout p-button-sm p-button-rounded p-button-raised w-full"
                        />
                        <Button
                            onClick={(e) => {
                                toast.current.clear();
                                onHide();
                            }}
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
                position="top-center"
                onHide={() => {
                    toast.current.clear();
                    onHide();
                }}
            />
            {/* <Button type="button" onClick={confirm} label="Submit" /> */}
        </>
    );
};

export default ToastConfirm;
