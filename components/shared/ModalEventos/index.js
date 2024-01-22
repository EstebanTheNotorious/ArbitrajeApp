import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import Evento from "../Evento";
import styles from './index.module.scss';
import ToastNotification from "../ToastNotification";
// import { Toast } from "primereact/toast";
import { requestValdationToken } from "../../../utils/axios/axios";
const ModalEventos = ({
    data, visible, setVisible
}) => {
    const [events, setEvents] = useState(data);
    const [editComplete, setEditComplete] = useState(false);
    const [deleteComplete, setDeleteComplete] = useState(false);

    useEffect(() => {
        if (data) setEvents(data)
    }, [data]);

    // console.log('event', data, events)
    const [showToast, setShowToast] = useState(false);
    const editEvent = async (e) => {
        const fechaHora = new Date(e.horaEvent);
        // Extraer la hora y los minutos de la fecha
        const hora = fechaHora.getHours();
        const minutos = fechaHora.getMinutes();
        const horaFormateada = hora.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0') + ':' + '00';
        const data = {
            id: e.idEvent,
            eventName: e.nombreEvento,
            eventDescription: e.descEvent,
            eventStartDate: e.rangoFechasEvent[0],
            eventEndDate: e.rangoFechasEvent[1] ? e.rangoFechasEvent[1] : e.rangoFechasEvent[0],
            eventHourStart: horaFormateada,
            adressDesciption: e.addressEvent,
            eventTypeId: e.eventTypeId,
            // countryId: 1,
            provinceId: e.provinceEvent.id,
            cityName: e.ciudadEvent,
            /* genderAllow: e.generoEvent === 'Masculino' ? 1 : e.generoEvent === 'Femenino' ? 2 : 4,
            proofId: e.selectedProofEvent */
            federatedPayValue: e.federatedValue,
            noFederatedPayValue: e.noFederatedValue,
            aditionalProofValue: e.aditionalProofValue,
            proofLimit: e.additionalProofValue
        }
        await requestValdationToken("Event/EditEvent", data, "put")
          .then((res) => {
            // console.log('res edit', res);
            if (res?.data?.value?.statusCode === 200) {
              loadListEvent();
              setEditComplete(true);
              setShowToast(true);
            }
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Edit Event",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }

    const deleteEvent = async (e) => {
        await requestValdationToken(`Event/DeleteEvent/${e.id}`, {}, "delete")
          .then((res) => {
            // console.log('res delete', res);
            if (res?.data?.statusCode === 200) {
              loadListEvent();
              setDeleteComplete(true);
              setShowToast(true);
            }
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Delete Event",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }

    const loadListEvent = async () => {
        await requestValdationToken("Event/GetAllEvents")
          .then((res) => {
            if (res?.data?.statusCode === 200) setEvents(res.data.result);
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Get All Events",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }
    return (
        <>
            <Dialog
                header="Administrar Eventos"
                visible={visible}
                className={`${styles.widthModalEventos}`}
                onHide={() => setVisible(false)}>
                <div className="row justify-content-center align-items-center">
                    <div className="col-12">
                        <h3 className="text-center">EVENTOS</h3>
                        {
                            events?.length > 0 &&
                            events.map((el, index) => (
                                <Evento data={el} onAction={editEvent} onActionDelete={deleteEvent} rol={'A'} key={index} className="mb-2" />
                            ))
                        }
                    </div>
                </div>
            </Dialog>
            {showToast && (
                <ToastNotification
                    summary={`EDITAR EVENTO`}
                    detail={'Se editó correctamente el evento'}
                    onActionClose={() => setShowToast(false)}
                />
            )}
            {
                showToast &&
                <>
                    {
                        editComplete &&
                        <ToastNotification
                            summary={`EDITAR EVENTO`}
                            detail={'Se editó correctamente el evento'}
                            onActionClose={() => {
                                setEditComplete(false);
                                setShowToast(false);
                            }}
                        />
                    }
                    {
                        deleteComplete &&
                        <ToastNotification
                            summary={`ELIMINAR EVENTO`}
                            detail={'Se eliminó correctamente el evento'}
                            onActionClose={() => {
                                setDeleteComplete(false);
                                setShowToast(false);
                            }}
                        />
                    }
                </>
            }
        </>
    );
};

export default ModalEventos;
