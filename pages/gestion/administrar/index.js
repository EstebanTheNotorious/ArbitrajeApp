import React, { useState, useEffect, useContext } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { styled } from "styled-components";
import { Panel } from "primereact/panel";
import { requestValdationToken } from "../../../utils/axios/axios";
import moment from "moment";
import { TabView, TabPanel } from "primereact/tabview";
import { Dropdown } from "primereact/dropdown";
import "../../../utils/constants/constants";
import {
  faAdd,
  faCheckCircle,
  faHandshakeAngle,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalEventos from "../../../components/shared/ModalEventos";
import ToastNotification from "../../../components/shared/ToastNotification";
import CreateEditEvent from "../../../components/shared/CreateEditEvent";
import AgregarCompetenciasAEvento from "../../../components/shared/AgregarCompetenciasAEvento";
import { EventContext } from "../../../providers/eventContext";
import SessionContext from "../../../providers/sessioncontext";
import { FindProvince } from "../../../utils/requests/requests";
import TablaInscritos from "../../../components/shared/TablaInscritos";
const Administrar = () => {
  const { session, verifySessionToken } = useContext(SessionContext);
  const { setChargeEvents } = useContext(EventContext);
  const [showToast, setShowToast] = useState(false);
  const [provinceName, setProvinceName] = useState('');

  const [activeIndexMain, setActiveIndexMain] = useState(0);
  // NOTIFICACIONES
  const [notificacionesRead, setNotificacionesRead] = useState([]);
  const [notificacionesUnread, setNotificacionesUnread] = useState([]);
  const [activeIndexNotification, setActiveIndexNotification] = useState(0);
  // NOTIFICACIONES

  // CREAR EVENTO
  const [clearFields, setClearFiels] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [showModalEventos, setShowModalEventos] = useState(false);
  // CREAR EVENTO

  // AGREGAR COMPETENCIAS A EVENTO
  const [rechargeEvents, setRechargeEvents] = useState(false);
  const [loadCompetencesByEvent, setLoadCompetencesByEvent] = useState(false);
  const [addingCompetences, setAddingCompetences] = useState(false);
  // AGREGAR COMPETENCIAS A EVENTO

  // APROBAR INSCRIPCIONES
  const [selectedEventToEnroll, setSelectedEventToEnroll] = useState(null);
  const [usersToEnroll, setUsersToEnroll] = useState([]);
  const [approvingInscription, setApprovingInscription] = useState(false);
  const [loadingUsersToEnroll, setLoadingUsersToEnroll] = useState(false);
  // APROBAR INSCRIPCIONES
  useEffect(() => {
    verifySessionToken();
    setShowToast(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    findProvinceName(localStorage?.getItem("email"));
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);
  const findProvinceName = async (email) => {
    await requestValdationToken(`Utils/GetUserProvince/${email}`).then(res => {
      console.log('res province', res)
      if (res.data.statusCode === 200 &&
        res.data.result &&
        localStorage?.getItem('rolId') === '2') setProvinceName(res.data.result.provinceName.toUpperCase());
      else setProvinceName('NACIONAL');
    }).catch(err => {
      console.error('[*] =========================> [*] ERROR GET USER PROVINCE', err);
      setProvinceName('');
    });
  }

  useEffect(() => {
    if (activeIndexMain === 0) loadAllNotifications();
    if (activeIndexMain === 1) loadListEvent();
    // if (activeIndexMain === 2) loadListEventWithoutProofs();
    if (activeIndexMain === 3) {
      loadListEvent();
      setSelectedEventToEnroll(null);
      setUsersToEnroll([]);
      setApprovingInscription(false);
    }
    setShowModalEventos(false);
    setShowToast(false);
  }, [activeIndexMain]);
  useEffect(() => {
    if (!showModalEventos) loadListEvent();
  }, [showModalEventos]);

  const leftIconSolicitudes = () => (
    <FontAwesomeIcon icon={faHandshakeAngle} className="mr-2" />
  );
  const leftIconEvents = () => (
    <FontAwesomeIcon icon={faListCheck} className="mr-2" />
  );
  const leftIconCompetences = () => (
    <FontAwesomeIcon icon={faAdd} className="mr-2" />
  );
  const leftIconAprobarInscripciones = () => (
    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
  );

  // NOTIFICACIONES
  const loadAllNotifications = async () => {
    await requestValdationToken(
      `${localStorage?.getItem('rolId') === '2' ?
        `Notification/GetAllNotification/${localStorage.getItem('email')}` :
        'Notification/GetAllNotification'}`)
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setNotificacionesRead(res.data.result?.read);
          setNotificacionesUnread(res.data.result?.unread);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get All Notification", err);
      });
  };
  const markNotificationAsRead = async (id) => {
    await requestValdationToken(`Notification/MarkAsread/${id}`, {}, "put")
      .then((res) => {
        if (res?.status === 200) {
          loadAllNotifications();
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Notification Mark As Read", err);
      });
  };
  const processNotification = async (criterio, id) => {
    if (criterio === "A") {
      await requestValdationToken(
        `Notification/ChangeStatus/${id}/2`,
        {},
        "put"
      )
        .then((res) => {
          if (res?.status === 200) loadAllNotifications();
        })
        .catch((err) => {
          console.error(
            "[*] ========= [*] ERROR Notification Change Status",
            err
          );
        });
    } else {
      await requestValdationToken(
        `Notification/ChangeStatus/${id}/3`,
        {},
        "put"
      )
        .then((res) => {
          if (res?.status === 200) loadAllNotifications();
        })
        .catch((err) => {
          console.error(
            "[*] ========= [*] ERROR Notification Change Status",
            err
          );
        });
    }
  };
  // NOTIFICACIONES

  // CREAR Y LISTAR EVENTOS
  const loadListEvent = async () => {
    await requestValdationToken(
      `${localStorage?.getItem('rolId') === '2' ?
        `Event/GetAllEvents/${localStorage.getItem('email')}` :
        'Event/GetAllEvents'}`)
      .then((res) => {
        if (res?.data?.statusCode === 200) setEventsList(res.data.result);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get All Events", err);
      });
  };
  const createEvent = async (e) => {
    setAddingCompetences(true);
    const fechaHora = new Date(e.horaEvent);
    // Extraer la hora y los minutos de la fecha
    const hora = fechaHora.getHours();
    const minutos = fechaHora.getMinutes();
    const horaFormateada =
      hora.toString().padStart(2, "0") +
      ":" +
      minutos.toString().padStart(2, "0") +
      ":" +
      "00";
    const provinceId =
      localStorage?.getItem('rolId') === 1 ?
        e.provinceEvent.id :
        await FindProvince(localStorage?.getItem('email'));
    const data = {
      eventName: e.nombreEvento,
      eventDescription: e.descEvent,
      eventStartDate: e.rangoFechasEvent[0],
      eventEndDate: e.rangoFechasEvent[1]
        ? e.rangoFechasEvent[1]
        : e.rangoFechasEvent[0],
      eventHourStart: horaFormateada,
      countryId: 1,
      provinceId,
      eventTypeId: 1,
      adressDesciption: e.addressEvent,
      cityName: e.ciudadEvent,
      federatedPayValue: e.federatedValue,
      noFederatedPayValue: e.noFederatedValue,
      aditionalProofValue: e.aditionalProofValue,
      proofLimit: e.proofsNumber,
    };
    await requestValdationToken("Event/CreateEvent", data, "post")
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setChargeEvents(true);
          setAddingCompetences(false);
          loadListEvent();
          setClearFiels(true);
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Create Event", err);
      });
  };
  // CREAR Y LISTAR EVENTOS

  // AGREGAR COMPETENCIAS A EVENTO
  const addCompetencesToEvent = async (e) => {
    const tmp = [];
    e.competences.forEach((x) => tmp.push(x.id));
    await requestValdationToken(
      "Event/AddProofsToEvent",
      {
        eventId: e.eventId,
        proofIds: tmp,
        competences: e.proofs,
      },
      "post"
    )
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setRechargeEvents(true);
          setLoadCompetencesByEvent(true);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Add Competences to Event", err);
      });
  };
  // AGREGAR COMPETENCIAS A EVENTO

  // APROBAR INSCRIPCIONES
  const loadUsersByEvent = async (event) => {
    setLoadingUsersToEnroll(true);
    await requestValdationToken(
      `User/GetAllUsersWithEventsAndProofs/${event.id}`
    )
      .then((res) => {
        if (res?.data?.statusCode === 200) setUsersToEnroll(res.data.result);
        if (res?.data?.statusCode === 204 || res?.status === 204)
          setUsersToEnroll([]);
        setLoadingUsersToEnroll(false);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get All Users With Events And Proofs", err);
      });
  };

  const approveSubscribe = async (e) => {
    setApprovingInscription(true);
    await requestValdationToken("Payments/CreatePayment", e.data, "post")
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setApprovingInscription(false);
          loadUsersByEvent(selectedEventToEnroll);
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Create Payment", err);
      });
  };
  // APROBAR INSCRIPCIONES

  return (
    <>
      {session && (
        <>
          <h2 className="text-center">ADMINISTRADOR {provinceName}</h2>
          <TabView
            activeIndex={activeIndexMain}
            onTabChange={(e) => setActiveIndexMain(e.index)}
          >
            <TabPanel
              header="Solicitudes de Usuarios"
              leftIcon={leftIconSolicitudes}
            >
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-8 col-lg-10 col-md-11 col-sm-12">
                  <Card>
                    <h3 className="text-center">Solicitudes</h3>
                    <TabView
                      activeIndex={activeIndexNotification}
                      onTabChange={(e) => setActiveIndexNotification(e.index)}
                    >
                      <TabPanel
                        header="No Leídas"
                        leftIcon="pi pi-eye-slash mr-2"
                      >
                        <div className="row justify-content-center p-fluid">
                          {notificacionesUnread.length > 0 ? (
                            notificacionesUnread.map((el, i) => (
                              <div className="col-12 mb-2" key={i}>
                                <Panel header={el.userName + " - " + el.email}>
                                  <h6 className="text-right font-bold mb-0">
                                    {moment(el.createdDate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </h6>

                                  <HeaderNotificacion>
                                    <h5 className="m-0">{el.title}</h5>
                                    {el.state === 1 && (
                                      <i
                                        className="pi pi-eye font-bold"
                                        style={{
                                          color: "var(--secondary-color)",
                                          fontSize: "25px",
                                        }}
                                      />
                                    )}
                                  </HeaderNotificacion>
                                  <hr />
                                  <p className="text-justify">
                                    {el.description}
                                  </p>
                                  <ContainerButtonsNotifications>
                                    <ContainerButtonNotifications>
                                      <Button
                                        label="Marcar como Leído"
                                        icon="pi pi-eye"
                                        className="p-button-sm p-button-raised"
                                        onClick={() =>
                                          markNotificationAsRead(el.id)
                                        }
                                      />
                                    </ContainerButtonNotifications>
                                  </ContainerButtonsNotifications>
                                </Panel>
                              </div>
                            ))
                          ) : (
                            <p
                              className="font-bold"
                              style={{ color: "var(--secondary-color)" }}
                            >
                              No existen Solicitudes sin leer.
                            </p>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel header="Leídas" leftIcon="pi pi-eye mr-2">
                        <div className="row justify-content-center p-fluid">
                          {notificacionesRead.length > 0 ? (
                            notificacionesRead.map((el, i) => (
                              <div className="col-12 mb-2" key={i}>
                                <Panel header={el.userName + " - " + el.email}>
                                  <h6 className="text-right font-bold mb-0">
                                    {moment(el.createdDate).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </h6>
                                  <HeaderNotificacion>
                                    <h5 className="m-0">{el.title}</h5>
                                    {el.state === 1 && (
                                      <i
                                        className="pi pi-eye font-bold"
                                        style={{
                                          color: "var(--secondary-color)",
                                          fontSize: "25px",
                                        }}
                                      />
                                    )}
                                  </HeaderNotificacion>
                                  <hr />
                                  <p className="text-justify">
                                    {el.description}
                                  </p>
                                  <ContainerButtonsNotifications>
                                    <ContainerButtonNotifications>
                                      <Button
                                        label="Aprobar"
                                        icon="pi pi-check"
                                        className="p-button-sm p-button-success p-button-raised"
                                        onClick={() =>
                                          processNotification("A", el.id)
                                        }
                                      />
                                    </ContainerButtonNotifications>
                                    <ContainerButtonNotifications>
                                      <Button
                                        label="Negar"
                                        icon="pi pi-times"
                                        className="p-button-sm p-button-danger p-button-text"
                                        onClick={() =>
                                          processNotification("N", el.id)
                                        }
                                      />
                                    </ContainerButtonNotifications>
                                  </ContainerButtonsNotifications>
                                </Panel>
                              </div>
                            ))
                          ) : (
                            <p
                              className="font-bold"
                              style={{ color: "var(--secondary-color)" }}
                            >
                              No existen Solicitudes leídas.
                            </p>
                          )}
                        </div>
                      </TabPanel>
                    </TabView>
                  </Card>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="Crear Eventos" leftIcon={leftIconEvents}>
              <CreateEditEvent
                criterio={"Crear"}
                onAction={createEvent}
                clearFields={clearFields}
              />
              {
                eventsList?.length > 0 &&
                <ContainerButtonEvents>
                  <Button
                    type="button"
                    label="Eventos"
                    badge={eventsList.length}
                    onClick={() => setShowModalEventos(true)}
                  />
                </ContainerButtonEvents>
              }

              <ModalEventos
                data={eventsList}
                visible={showModalEventos}
                setVisible={setShowModalEventos}
              />
              {activeIndexMain === 1 && showToast && (
                <ToastNotification
                  summary={`Creacion de Evento`}
                  detail={"El evento se creó exitosamente"}
                  onActionClose={() => setShowToast(false)}
                />
              )}
            </TabPanel>

            <TabPanel
              header="Agregar Competencias a Eventos"
              leftIcon={leftIconCompetences}
            >
              <AgregarCompetenciasAEvento
                onAction={addCompetencesToEvent}
                loadCompetences={loadCompetencesByEvent}
                rechargeEvents={rechargeEvents}
                setLoadCompetences={setLoadCompetencesByEvent}
                addingCompetences={addingCompetences}
              />
              {
                eventsList?.length > 0 &&
                <ContainerButtonEvents>
                  <Button
                    type="button"
                    label="Eventos"
                    badge={eventsList.length}
                    onClick={() => setShowModalEventos(true)}
                  />
                </ContainerButtonEvents>
              }
              <ModalEventos
                data={eventsList}
                visible={showModalEventos}
                setVisible={setShowModalEventos}
              />
            </TabPanel>

            <TabPanel
              header="Aprobar Inscripciones"
              leftIcon={leftIconAprobarInscripciones}
            >
              {/* <div className="row justify-content-center align-items-center mb-3">
                        <div className="col-xl-7 col-lg-8 col-md-9 col-sm-12">
                            <Card className="mb-3">
                                <h3 className="text-center">Últimos Eventos</h3>
                                <AwesomeSlider animation="openAnimation" className="mb-3">
                                    <div data-src="/assets/images/uno.jpg" />
                                    <div data-src="/assets/images/dos.jpg" />
                                    <div data-src="/assets/images/tres.jpg" />
                                </AwesomeSlider>
                            </Card>
                        </div>
                    </div> */}

              <div className="row justify-content-center mb-3">
                <div className="col-xl-10 col-md-11 col-sm-12">
                  <div className="row justify-content-center mb-3">
                    <div className="col-xl-4 col-lg-6 col-md-9 col-sm-12">
                      <h6 className="text-left text-primary">Eventos</h6>
                      <Dropdown
                        value={selectedEventToEnroll}
                        onChange={(e) => {
                          setSelectedEventToEnroll(e.value);
                          loadUsersByEvent(e.value);
                        }}
                        options={eventsList}
                        optionLabel="eventName"
                        placeholder="Selecciona un Evento"
                        className="w-full"
                      />
                    </div>
                  </div>
                  {usersToEnroll.length > 0 && (
                    <div className="card p-2">
                      <div className="row justify-content-center">
                        <div className="col-12">
                          <TablaInscritos data={usersToEnroll}
                            event={selectedEventToEnroll}
                            onAction={approveSubscribe}
                            approveFinish={approvingInscription}
                            loading={loadingUsersToEnroll} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeIndexMain === 3 && showToast && (
                    <ToastNotification
                      summary={`Inscripcion de deportista a ${selectedEventToEnroll.eventName}`}
                      detail={"Se aprobó la inscripción del deportista"}
                      onActionClose={() => setShowToast(false)}
                    />
                  )}
                </div>
              </div>
            </TabPanel>
          </TabView>
        </>
      )}
    </>
  );
};

export default Administrar;

const ContainerButtonEvents = styled.div`
  position: fixed;
  right: 5rem;
  bottom: 5rem;
  left: auto;
`;
const ContainerButtonsNotifications = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;
const ContainerButtonNotifications = styled.div`
  padding-inline: 0.25rem;
`;

const HeaderNotificacion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;