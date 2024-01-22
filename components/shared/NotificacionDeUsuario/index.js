import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import styles from "./index.module.scss";
import { styled } from "styled-components";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
const NotificacionDeUsuario = ({ el, onAction, severity = '', criterio = '' }) => {

    const [valueTitulo, setValueTitulo] = useState('')
    const [valueDesc, setValueDesc] = useState('')
    const [startEdit, setStartEdit] = useState(false)


    useEffect(() => {
        if (el) {
            setValueTitulo(el.title);
            setValueDesc(el.description)
        }
    }, [el]);

    /* const clear = (submit) => {
        toastBC.current.clear();
        if (submit) {
            show();
            actionLogout();
        } else actionCancel();
    };
 */
    /* const show = () => {
        toast.current.show({
            severity: "info",
            summary: summary,
            detail: "",
        });
    }; */

    /* const confirm = () => {
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
 */

    const sendAction = (criterio) => {
        onAction({ action: criterio, element: data });
    }
    return (
        <>

            {
                el &&
                <>
                    {
                        !startEdit ?
                            <Panel header={valueTitulo}
                                pt={{
                                    header: { className: severity === 'A' ? 'bg-blue-50 border-blue-100' : severity === 'R' ? 'bg-pink-50 border-pink-100' : '' },
                                    content: { className: severity === 'A' ? 'bg-blue-100' : severity === 'R' ? 'bg-pink-100' : '' }
                                }}>
                                <h5 className='text-right font-bold mb-0'>{moment(el.createdDate).format('DD-MM-YYYY')}</h5>
                                <p className="m-0">{valueDesc}</p>
                                <hr />
                                <ContainerButtonsNotifications>
                                    {
                                        criterio === 'Crear' &&
                                        <ContainerButtonNotifications>
                                            <Button label="Editar" icon="pi pi-pencil" className="p-button-sm p-button-raised" onClick={() => setStartEdit(true)} />
                                        </ContainerButtonNotifications>
                                    }
                                    <ContainerButtonNotifications>
                                        <Button label="Eliminar" icon="pi pi-times" className="p-button-sm p-button-danger p-button-raised" onClick={() => onAction({ act: 'delete', data: el.id })} />
                                    </ContainerButtonNotifications>
                                </ContainerButtonsNotifications>
                            </Panel>
                            :
                            <Card>
                                <span className="p-float-label w-100 mb-4">
                                    <InputText id="title" value={valueTitulo} onChange={(e) => setValueTitulo(e.target.value)} className="w-100" />
                                    <label htmlFor="title">Título Notificación</label>
                                </span>

                                <span className="p-float-label w-100 mb-2">
                                    <InputTextarea id="desc" value={valueDesc} onChange={(e) => setValueDesc(e.target.value)} rows={5} cols={30} className="w-100" />
                                    <label htmlFor="desc">Username</label>
                                </span>
                                <ContainerButtonsNotifications>
                                    <ContainerButtonNotifications>

                                        <Button label="Cancelar" icon="pi pi-ban" className="p-button-sm p-button-warning p-button-raised" onClick={() => setStartEdit(false)} />
                                    </ContainerButtonNotifications>
                                    <ContainerButtonNotifications>

                                        <Button label="Aceptar" icon="pi pi-check" className="p-button-sm p-button-danger p-button-text" onClick={() => {
                                            onAction({ act: 'edit', data: { ...el, title: valueTitulo, description: valueDesc } })
                                            setStartEdit(false);
                                        }} />
                                    </ContainerButtonNotifications>
                                </ContainerButtonsNotifications>
                            </Card>
                    }

                </>
            }

        </>
    );
};

export default NotificacionDeUsuario;
const ContainerButtonsNotifications = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
`;
const ContainerButtonNotifications = styled.div`
    padding-inline: .25rem;
`;