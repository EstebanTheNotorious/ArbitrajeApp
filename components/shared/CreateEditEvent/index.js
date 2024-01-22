import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
// import { Toast } from "primereact/toast";
import { styled } from "styled-components";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { requestValdationToken } from "../../../utils/axios/axios";
// import { InputText } from "primereact/inputtext";
// import { InputTextarea } from "primereact/inputtextarea";
const CreateEditEvent = ({ data = null, criterio, onAction, clearFields = false }) => {
    const [idEvent, setIdEvent] = useState(null);
    const [nombreEvento, setNombreEvento] = useState('');
    const [descEvent, setDescEvent] = useState('');
    const [rangoFechasEvent, setRangoFechasEvent] = useState(null);
    const [horaEvent, setHoraEvent] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [proofs, setProofs] = useState([]);
    const [provinceEvent, setProvinceEvent] = useState(null);
    const [ciudadEvent, setCiudadEvent] = useState('');
    const [addressEvent, setAddressEvent] = useState('');
    // const [modalidadEvent, setModalidadEvent] = useState('');
    const [selectedProofEvent, setSelectedProofEvent] = useState(null);
    // const [generoEvent, setGeneroEvent] = useState('');
    const [federatedValue, setFederatedValue] = useState(0);
    const [noFederatedValue, setNoFederatedValue] = useState(0);
    const [aditionalProofValue, setAditionalProofValue] = useState(0);
    const [proofsNumber, setProofsNumber] = useState(7);

    useEffect(() => {
      if (provinces.length === 0) loadProvinces();
      if (criterio === "Crear") clear();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (criterio === 'Editar' && data && provinces.length > 0) {
            // console.log('data editar', data);
            setIdEvent(data.id);
            setNombreEvento(data.eventName);
            setDescEvent(data.eventDescription);

            const currentDate = new Date().toISOString().split('T')[0];
            const dateTimeString = `${currentDate}T${data.eventHourStart}`;
            setHoraEvent(new Date(dateTimeString));

            const offsetMinutes = -300; // Ecuador tiene un desplazamiento de -5 horas (-300 minutos)
            const dateUTCStart = new Date(data.eventStartDate);
            const dateStart = new Date(dateUTCStart.getTime() + offsetMinutes * 60 * 1000);
            const dateUTCEnd = new Date(data.eventEndDate);
            const dateEnd = new Date(dateUTCEnd.getTime() + offsetMinutes * 60 * 1000);

            const fechaAjustadaStart = sumarUnDia(dateStart);
            const fechaAjustadaEnd = sumarUnDia(dateEnd);

            if (fechaAjustadaStart !== fechaAjustadaEnd) {
                setRangoFechasEvent([fechaAjustadaStart, fechaAjustadaEnd]);
            } else setRangoFechasEvent([fechaAjustadaStart]);

            // console.log('dates a recibir: ', dateStart, dateEnd)
            setProvinceEvent(provinces.find(x => x.id === data.provinceId));
            setCiudadEvent(data.cityName);
            // setModalidadEvent('');
            /* "id": 1,
                "proofName": "Atletismo",
                "isCompose": 2,
                "proofTypeId": 2 */
            setSelectedProofEvent(data.proof);
            setAddressEvent(data.adressDesciption);
            // setGeneroEvent(data.genderAllow === 1 ? 'Masculino' : data.genderAllow === 2 ? 'Femenino' : 'Ambos');
            // setSelectedProofEvent(data.proof.id);
            setFederatedValue(data.federatedPayValue);
            setNoFederatedValue(data.noFederatedPayValue);
            setAditionalProofValue(data.aditionalProofValue);
            setProofsNumber(data.proofLimit);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, provinces]);

    useEffect(() => {
        if (clearFields) clear()
    }, [clearFields]);

    /* function ajustarAMedianoche(date) {
        const fecha = new Date(date);
        fecha.setUTCHours(0, 0, 0, 0); // Establece la hora en 00:00:00
        return fecha;
    } */

    function sumarUnDia(fecha) {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Suma un día
        return nuevaFecha;
    }

    const clear = () => {
        setNombreEvento('');
        setDescEvent('');
        setRangoFechasEvent(null);
        setHoraEvent(null);
        setProvinceEvent(null);
        setCiudadEvent('');
        // setModalidadEvent('');
        setSelectedProofEvent(null);
        setAddressEvent('');
        // setGeneroEvent('');
        setFederatedValue(0);
        setNoFederatedValue(0);
        setAditionalProofValue(0);
        setProofsNumber(7);
    }

    const loadProvinces = async () => {
        await requestValdationToken("Utils/GetAllProvinces")
            .then((res) => {
                // console.log('res provinces', res);
                if (res?.status === 200) {
                    if (res.data?.result?.length > 0) {
                        setProvinces(res.data.result.filter((x) => x.countryId === 1));
                    }
                }
            })
            .catch((err) => {
                console.error(
                    "[*] ========= [*] ERROR Get All Provinces",
                    err
                );
                // setMsgErrorLogin(err.response.data)
            });
    }
    /* const loadProofsByTypeOfProof = async (value) => {
        setModalidadEvent(value);
        setProofs([]);
        await requestValdationToken(`Proof/GetProofsByType?IsProofCompose=${value === 'Simple' ? '2' : '1'}`).then(res => {
            if (res.status === 200) setProofs(res.data.result);
        });
    } */

    const startAction = () => {
        if (criterio === 'Crear') {
            onAction({
                nombreEvento,
                descEvent,
                rangoFechasEvent,
                horaEvent,
                provinceEvent,
                ciudadEvent,
                addressEvent,
                // modalidadEvent,
                // selectedProofEvent,
                // generoEvent
                federatedValue,
                noFederatedValue,
                aditionalProofValue,
                proofsNumber
            });
        } else {
            onAction({
                idEvent,
                nombreEvento,
                descEvent,
                rangoFechasEvent,
                horaEvent,
                addressEvent,
                eventTypeId: data.eventTypeId,
                provinceEvent,
                ciudadEvent,
                // modalidadEvent
                // selectedProofEvent,
                // generoEvent,
                federatedValue,
                noFederatedValue,
                aditionalProofValue,
                proofsNumber
            })
        }
    }
    return (
        <div className="row justify-content-center mb-3">
            <div className="col-xl-10 col-md-11 col-sm-12">
                <Card>
                    <h3 className='text-center'>{criterio.toUpperCase()} EVENTO</h3>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 mb-3">
                            <span className="p-float-label w-100">
                                <InputText
                                    id="nombreEvento"
                                    value={nombreEvento}
                                    onChange={(e) => setNombreEvento(e.target.value)}
                                    className='w-100' />
                                <label htmlFor="nombreEvento">Nombre del Evento</label>
                            </span>
                        </div>
                        <div className="col-12 mb-3">
                            <span className="p-float-label w-100">
                                <InputTextarea
                                    id="descEvento"
                                    value={descEvent}
                                    onChange={(e) => setDescEvent(e.target.value)}
                                    rows={5}
                                    cols={30}
                                    className='w-100' />
                                <label htmlFor="descEvento">Description</label>
                            </span>
                        </div>
                        <hr />
                        <div className="col-md-8 col-sm-12 text-center mb-3">
                            <label htmlFor="fechasEvento" className="block mb-2">
                                Fechas del evento
                            </label>
                            <Calendar
                                className="w-full"
                                id="fechasEvento"
                                value={rangoFechasEvent}
                                onChange={(e) => setRangoFechasEvent(e.value)}
                                inline
                                selectionMode="range"
                                showWeek
                                locale="es" />
                        </div>
                        <div className="col-md-4 col-sm-6 text-center mb-3">
                            <div className="">
                                <label htmlFor="horaEvento" className="block mb-2">
                                    Hora del evento
                                </label>
                                <Calendar
                                    className="text-center"
                                    id="horaEvento"
                                    value={horaEvent}
                                    onChange={(e) => setHoraEvent(e.value)}
                                    timeOnly />
                            </div>
                        </div>
                        <hr />

                        {
                            localStorage?.getItem('rolId') === '1' &&
                            <div className="col-6 mb-3">
                                <span className="p-float-label w-100">
                                    <Dropdown
                                        inputId="provinceEvent"
                                        value={provinceEvent}
                                        onChange={(e) => setProvinceEvent(e.value)}
                                        options={provinces}
                                        optionLabel="provinceName"
                                        filter
                                        className="w-100 md:w-14rem" />
                                    <label htmlFor="provinceEvent">Provincia del Evento</label>
                                </span>
                            </div>
                        }
                        <div className="col-6 mb-3">
                            <span className="p-float-label w-100">
                                <InputText
                                    id="ciudadEvent"
                                    value={ciudadEvent}
                                    onChange={(e) => setCiudadEvent(e.target.value)}
                                    className="w-100 md:w-14rem" />
                                <label htmlFor="ciudadEvent">Ciudad del Evento</label>
                            </span>
                        </div>

                        <div className="col-12 mb-3">
                            <span className="p-float-label w-full">
                                <InputTextarea
                                    id="address"
                                    value={addressEvent}
                                    onChange={(e) => setAddressEvent(e.target.value)}
                                    rows={5}
                                    cols={30}
                                    className="w-full" />
                                <label htmlFor="address">Dirección del Evento</label>
                            </span>
                        </div>
                        {/* <hr /> */}

                        {
                            criterio === 'Crear' &&
                            <>
                                {/* <label htmlFor="modalidadEvento" className="block text-center">
                                    Modalidad del evento
                                </label>
                                <div id='modalidadEvento' className="col-12 d-flex justify-content-evenly text-center mb-3">
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="singles"
                                            name="modalidad"
                                            value="Simple"
                                            onChange={(e) => loadProofsByTypeOfProof(e.value)}
                                            checked={modalidadEvent === 'Simple'} />
                                        <label htmlFor="singles" className="ml-2">Simple</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <RadioButton
                                            inputId="team"
                                            name="modalidad"
                                            value="Compuesta"
                                            onChange={(e) => loadProofsByTypeOfProof(e.value)}
                                            checked={modalidadEvent === 'Compuesta'} />
                                        <label htmlFor="team" className="ml-2">Compuesta</label>
                                    </div>
                                </div> */}
                                {/* <hr />
                                <div className="col-6 text-center my-3">
                                    <span className="p-float-label w-100">
                                        <Dropdown
                                            inputId="pruebasEvento"
                                            value={selectedProofEvent}
                                            onChange={(e) => setSelectedProofEvent(e.value)}
                                            options={proofs}
                                            optionLabel="proofName"
                                            className="w-100 md:w-14rem"
                                            // disabled={modalidadEvent === ''}
                                        />
                                        <label htmlFor="pruebasEvento">Prueba del Evento</label>
                                    </span>
                                </div> */}

                                {/* <hr /> */}
                            </>
                        }
                        {/* <label htmlFor="generoEvento" className="block text-center">
                            Género del evento
                        </label>
                        <div id='generoEvento' className="col-12 d-flex justify-content-evenly text-center">
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="hombre"
                                    name="genero"
                                    value="Masculino"
                                    onChange={(e) => setGeneroEvent(e.value)}
                                    checked={generoEvent === 'Masculino'} />
                                <label htmlFor="hombre" className="ml-2">Masculino</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="mujer"
                                    name="genero"
                                    value="Femenino"
                                    onChange={(e) => setGeneroEvent(e.value)}
                                    checked={generoEvent === 'Femenino'} />
                                <label htmlFor="mujer" className="ml-2">Femenino</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton
                                    inputId="ambos"
                                    name="genero"
                                    value="Ambos"
                                    onChange={(e) => setGeneroEvent(e.value)}
                                    checked={generoEvent === 'Ambos'} />
                                <label htmlFor="ambos" className="ml-2">Ambos</label>
                            </div>
                        </div> */}

                        <div className="col-6 mb-3">
                            <span className="p-float-label w-100">
                                <InputNumber
                                    inputId="federatedValue"
                                    value={federatedValue}
                                    onValueChange={(e) => setFederatedValue(e.value)}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    className="w-100" />
                                <label htmlFor="federatedValue">Valor Federado del Evento</label>
                            </span>
                        </div>
                        <div className="col-6 mb-3">
                            <span className="p-float-label w-100">
                                <InputNumber
                                    inputId="noFederatedValue"
                                    value={noFederatedValue}
                                    onValueChange={(e) => setNoFederatedValue(e.value)}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    className="w-100" />
                                <label htmlFor="noFederatedValue">Valor No Federado del Evento</label>
                            </span>
                        </div>
                        <div className="col-6 mb-3">
                            <span className="p-float-label w-100">
                                <InputNumber
                                    inputId="aditionalProofValue"
                                    value={aditionalProofValue}
                                    onValueChange={(e) => setAditionalProofValue(e.value)}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    className="w-100" />
                                <label htmlFor="aditionalProofValue">Valor Por Prueba Adicional</label>
                            </span>
                        </div>
                        <div className="col-6 mb-3">
                            <p className="mb-2" style={{ fontSize: '12px' }}>Número de Pruebas</p>
                            <InputNumber
                                value={proofsNumber}
                                onValueChange={(e) => setProofsNumber(e.value)}
                                showButtons
                                buttonLayout="vertical"
                                style={{ width: '4rem' }}
                                min={0}
                                // decrementButtonClassName="p-button-secondary"
                                // incrementButtonClassName="p-button-secondary"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus" />
                        </div>
                    </div>
                    <hr />

                    <div className="row justify-content-end">
                        <div className="col-12 text-center">
                            <Button
                                type="button"
                                label={`${criterio} Evento`}
                                className="p-button-sm p-button-raised"
                                onClick={startAction} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreateEditEvent;
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
    /* background: var(--surface-primary); */
    padding-inline: .5rem;
    /* color: var(--primary-color-text); */

    .gender {

    }
`;