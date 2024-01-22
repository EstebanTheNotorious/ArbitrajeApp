import React, { useEffect, useRef, useState } from "react";
// import { Dropdown } from "primereact/dropdown";
// import ToastNotification from "../ToastNotification";
import { MultiSelect } from 'primereact/multiselect';
// import { Card } from "primereact/card";
// import { requestValdationToken } from "../../../utils/axios/axios";
import { Button } from "primereact/button";
import { requestValdationToken } from "../../../utils/axios/axios";

const AgregarCompetenciasEspecialesAEvento = ({ idCompetenceAdd = null, onActionCompetencesAdd }) => {
    // const [showToast, setShowToast] = useState(false);

    // AGREGAR COMPETENCIA
    const [competences, setCompetences] = useState([]);
    const [competencesSelectedTriatlon, setCompetencesSelectedTriatlon] = useState([]);
    const [competencesSelectedPentatlon, setCompetencesSelectedPentatlon] = useState([]);
    const [competencesSelectedHeptatlon, setCompetencesSelectedHeptatlon] = useState([]);
    const [competencesSelectedDecatlon, setCompetencesSelectedDecatlon] = useState([]);
    const [competecesAdded, setCompetecesAdded] = useState(false);

    /* useEffect(() => {
        loadAllCompetences();
    }, []); */

    useEffect(() => {
      // setShowToast(false);
      setCompetencesSelectedTriatlon([]);
      setCompetencesSelectedPentatlon([]);
      setCompetencesSelectedHeptatlon([]);
      setCompetencesSelectedDecatlon([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* useEffect(() => {

    }, []);

    const loadAllCompetences = async () => {
        await requestValdationToken(`Proof/GetAllProofs`).then(res => {
            if (res.data.statusCode === 200) setCompetences(res.data.result);
        }).catch(err => console.error('loadCompetences', err.response.data))
    } */

    // const startAddCompetences = () => onAction({ eventId: eventSelected.id, competences: competencesSelected });
    const loadSpecialProofs = async () => {
        await requestValdationToken(
          `Proof/GetCompetencesByProofId/${idCompetenceAdd}`
        )
          .then((res) => {
            // console.log('res spec proof', res);
            if (res?.data?.statusCode === 200) setCompetences(res.data.result);
            if (res?.data?.statusCode === 204) setCompetences([]);
          })
          .catch((err) => {
            console.error(
              "[*] ========= [*] ERROR Load Special Proofs",
              err
            );
            // setMsgErrorLogin(err.response.data)
          });
    }
    const verifySpecialProofs = () => {
        return (idCompetenceAdd === 24 && competencesSelectedTriatlon.length !== 3)
            || (idCompetenceAdd === 25 && competencesSelectedDecatlon.length !== 10)
            || (idCompetenceAdd === 26 && competencesSelectedHeptatlon.length !== 7)
            || (idCompetenceAdd === 27 && competencesSelectedPentatlon.length !== 5)
    }
    const returnProofName = () => {
        if (idCompetenceAdd === 24) return 'Triatlon';
        if (idCompetenceAdd === 25) return 'Decatlon'
        if (idCompetenceAdd === 26) return 'Heptatlon'
        if (idCompetenceAdd === 27) return 'Pentatlon'
    }
    return (
        <>
            {
                idCompetenceAdd &&
                <div className="col-3 text-center">
                    <Button
                        type="button"
                        label={`${idCompetenceAdd === 24 ? 'Triatlon'
                            : idCompetenceAdd === 25 ? 'Decatlon'
                                : idCompetenceAdd === 26 ? "Heptatlon"
                                    : 'Pentatlon'}`}
                        className="p-button-sm p-button-raised"
                        onClick={loadSpecialProofs}
                    />
                    {
                        competences.length > 0 &&
                        <div className="row justify-content-center align-items-center mt-3">
                            <div className="col-12 text-center">
                                <span className="p-float-label w-full">
                                    <MultiSelect
                                        id="competencesAdd"
                                        value={
                                            idCompetenceAdd === 24 ? competencesSelectedTriatlon
                                                : idCompetenceAdd === 25 ? competencesSelectedDecatlon
                                                    : idCompetenceAdd === 26 ? competencesSelectedHeptatlon
                                                        : competencesSelectedPentatlon
                                        }
                                        onChange={(e) => {
                                            if (idCompetenceAdd === 24) setCompetencesSelectedTriatlon(e.value);
                                            if (idCompetenceAdd === 25) setCompetencesSelectedDecatlon(e.value);
                                            if (idCompetenceAdd === 26) setCompetencesSelectedHeptatlon(e.value);
                                            if (idCompetenceAdd === 27) setCompetencesSelectedPentatlon(e.value);
                                        }}
                                        options={competences}
                                        optionLabel="competenceName"
                                        selectionLimit={
                                            idCompetenceAdd === 24 ? 3
                                                : idCompetenceAdd === 25 ? 10
                                                    : idCompetenceAdd === 26 ? 7
                                                        : 5
                                        }
                                        display="chip"
                                        className="w-100" />
                                    <label htmlFor="competencesAdd">Competencias {returnProofName()}</label>
                                </span>
                            </div>

                            {
                                !competecesAdded ?
                                    <div className="col-12 text-center">
                                        <Button
                                            type="button"
                                            label={`Agregar ${returnProofName()}`}
                                            className="p-button-sm p-button-secondary p-button-raised"
                                            onClick={() => {
                                                setCompetecesAdded(true);
                                                if (idCompetenceAdd === 24) onActionCompetencesAdd({ proofId: idCompetenceAdd, competenceIds: competencesSelectedTriatlon });
                                                if (idCompetenceAdd === 25) onActionCompetencesAdd({ proofId: idCompetenceAdd, competenceIds: competencesSelectedDecatlon });
                                                if (idCompetenceAdd === 26) onActionCompetencesAdd({ proofId: idCompetenceAdd, competenceIds: competencesSelectedHeptatlon });
                                                if (idCompetenceAdd === 27) onActionCompetencesAdd({ proofId: idCompetenceAdd, competenceIds: competencesSelectedPentatlon });

                                            }}
                                            disabled={verifySpecialProofs()}
                                        />
                                    </div>
                                    :
                                    <div className="col-12 text-center">
                                        <p className="text-center font-bold">{`${idCompetenceAdd === 24 ? 'Triatlon'
                                            : idCompetenceAdd === 25 ? 'Decatlon'
                                                : idCompetenceAdd === 26 ? "Heptatlon"
                                                    : 'Pentatlon'}`} Agregado</p>
                                    </div>
                            }
                        </div>
                    }
                </div>
            }

        </>
    );
};

export default AgregarCompetenciasEspecialesAEvento;
