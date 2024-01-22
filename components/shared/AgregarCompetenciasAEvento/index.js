import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import ToastNotification from "../ToastNotification";
import { MultiSelect } from 'primereact/multiselect';
import { Card } from "primereact/card";
import { requestValdationToken } from "../../../utils/axios/axios";
import { Button } from "primereact/button";
import AgregarCompetenciasEspecialesAEvento from "../AgregarCompetenciasEspecialesAEvento";

const AgregarCompetenciasAEvento = ({ data, onAction, loadCompetences, setLoadCompetences, addingCompetences, rechargeEvents }) => {
    const [showToast, setShowToast] = useState(false);
    const [events, setEvents] = useState(data);
    const [eventSelected, setEventSelected] = useState(null);

    // AGREGAR COMPETENCIA
    const [competences, setCompetences] = useState(null);
    const [competencesSelected, setCompetencesSelected] = useState([]);
    const [competencesAdd, setCompetencesAdd] = useState([]);

    useEffect(() => {
      loadListEventWithoutProofs();
      loadAllCompetences();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loadCompetences) {
            loadAllCompetences();
            setShowToast(true);
            setEventSelected(null);
            setCompetencesSelected([]);
        }
    }, [loadCompetences]);

    useEffect(() => {
        loadListEventWithoutProofs();
    }, [rechargeEvents]);

    const loadListEventWithoutProofs = async () => {
        await requestValdationToken("Event/GetEventsWithoutProofs")
          .then((res) => {
            if (res?.data?.statusCode === 200) setEvents(res.data.result);
            if (res?.data?.statusCode === 204) setEvents([]);
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Load List Event Without Proofs",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }

    const loadAllCompetences = async () => {
        await requestValdationToken(`Proof/GetAllProofs`)
          .then((res) => {
            if (res?.data?.statusCode === 200) setCompetences(res.data.result);
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Load All Competences",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }

    const startAddCompetences = () => onAction({ eventId: eventSelected.id, competences: competencesSelected, proofs: addSpecialProofsToEvent() });

    const verifySpecialProofsAdded = () => {
        // console.log('competencesSelected', competencesSelected.filter(x => x.id === 24))
        if (competencesSelected.some(x => x.id === 24) ||
            competencesSelected.some(x => x.id === 25) ||
            competencesSelected.some(x => x.id === 26) ||
            competencesSelected.some(x => x.id === 27)) {
            return (
                <div className="row justify-content-center align-items-center">
                    {
                        competencesSelected.filter(x => x.id === 24 ||
                            x.id === 25 ||
                            x.id === 26 ||
                            x.id === 27).map((el, i) => (
                                <AgregarCompetenciasEspecialesAEvento
                                    idCompetenceAdd={el.id}
                                    onActionCompetencesAdd={(e) => setCompetencesAdd(list => list.concat(e))} key={i} />
                            ))
                    }
                </div>
            )
        } else return null;
    }
    const addSpecialProofsToEvent = (e) => {
        const tmp = [];
        // console.log('e setCompetencesAdd', competencesAdd)
        competencesAdd.forEach(x => {
            tmp.push({ proofId: x.proofId, competenceIds: returnIdsProofs(x.competenceIds) })
        })
        return tmp;
    }
    const returnIdsProofs = (data) => {
        const tmp = [];
        data.forEach(x => tmp.push(x.id));
        return tmp;
    }

    return (
        <>
            <div className="row justify-content-center mb-3">
                <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                    <Card>
                        <h3 className='text-center'>Agregar competencias</h3>
                        <div className="row justify-content-center align-items-center mt-4">
                            <div className="col-md-6 col-sm-12 mb-3">
                                <span className="p-float-label w-100">
                                    <Dropdown inputId="eventToAddCompetence"
                                        value={eventSelected}
                                        onChange={(e) => setEventSelected(e.value)}
                                        options={events}
                                        emptyMessage='No hay eventos disponibles'
                                        optionLabel="eventName"
                                        className="w-100 md:w-14rem" />
                                    <label htmlFor="eventToAddCompetence">Evento</label>
                                </span>
                            </div>
                        </div>

                        {
                            eventSelected &&
                            <>
                                <p className='text-center text-primary mt-4 mb-0'>Debes agregar <b>{eventSelected.proofLimit} o más competencia{eventSelected.proofLimit !== 1 ? 's' : ''}</b> para este evento</p>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12 my-3 text-center">
                                        <span className="p-float-label w-full">
                                            <MultiSelect
                                                id="competences"
                                                value={competencesSelected}
                                                onChange={(e) => setCompetencesSelected(e.value)}
                                                options={competences}
                                                optionLabel="proofName"
                                                // selectionLimit={eventSelected.proofLimit}
                                                display="chip"
                                                maxSelectedLabels={3}
                                                className="w-100" />
                                            <label htmlFor="competences">Competencias</label>
                                        </span>
                                    </div>
                                </div>

                                <hr />
                                {
                                    verifySpecialProofsAdded(competencesSelected)
                                }

                                <div className="row justify-content-end">
                                    <div className="col-12 text-center">
                                        <Button
                                            type="button"
                                            icon={`pi pi-${addingCompetences ? 'spin pi-spinner' : 'check'}`}
                                            label={`Agregar Competencia${competencesSelected.length === 1 ? '' : 's'}`}
                                            className="p-button-sm p-button-raised"
                                            onClick={startAddCompetences}
                                            disabled={competencesSelected.length < eventSelected.proofLimit} />
                                    </div>
                                </div>
                            </>
                        }
                        {/* {
                            eventSelected && competences?.length === 0 &&
                            <p className="text-primary text-center">No existen competencias disponibles para agregar al {eventSelected.eventName}</p>
                        } */}
                    </Card>
                </div>
            </div>
            {showToast && (
                <ToastNotification
                    summary={`AGREGAR COMPETENCIAS A EVENTO`}
                    detail={'Se agregaron las competencias seleccionadas correctamente'}
                    onActionClose={() => {
                        setLoadCompetences(false);
                        setShowToast(false);
                    }}
                />
            )}
        </>
    );
};

export default AgregarCompetenciasAEvento;
