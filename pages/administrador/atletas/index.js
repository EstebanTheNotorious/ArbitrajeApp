import React, { useState, useEffect, useMemo, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import UnsubscribeUserFromEvent from "../../../components/shared/UnsubscribeUserFromEvent";
import moment from "moment";
import ToastNotification from "../../../components/shared/ToastNotification";
import { requestValdationToken } from "../../../utils/axios/axios";
import countryList from "react-select-country-list";
import SessionContext from "../../../providers/sessioncontext";
import { ordenar } from "../../../utils/constants/constants";
const Atletas = () => {
  const { session, verifySessionToken } = useContext(SessionContext);
  const countries = useMemo(() => countryList().getData(), []);
  const [userEvents, setUserEvents] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsSon, setExpandedRowsSon] = useState(null);
  const [expandedRowsGrandSon, setExpandedRowsGrandSon] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reembolsar, setReembolsar] = useState(0);

  useEffect(() => {
    verifySessionToken();
    loadUserEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserEventDetails = async () => {
    setLoading(true);
    await requestValdationToken(
      `${
        localStorage?.getItem("rolId") === "2"
          ? `User/GetUserEventsDetailsRol/${localStorage.getItem("email")}`
          : "User/GetUserEventsDetails"
      }`
    )
      .then((res) => {
        // console.log('res user events', res);
        if (res?.status === 200) {
          setLoading(false);
          setUserEvents(res.data?.sort(ordenar));
        }
        if (res?.status === 204) setUserEvents([]);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get User Events Details", err);
        // setMsgErrorLogin(err.response.data)
      });
  };

  const expandAll = () => {
    let _expandedRows = {};

    userEvents.forEach((x) => (_expandedRows[`${x.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    return rowData.events.length > 0;
  };
  const allowExpansionSon = (rowData) => {
    return rowData.proofs.length > 0;
  };
  const allowExpansionGrandSon = (rowData) => {
    return rowData.competences.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <DataTable
        value={data.events}
        expandedRows={expandedRowsSon}
        onRowToggle={(e) => setExpandedRowsSon(e.data)}
        rowExpansionTemplate={rowExpansionTemplateSon}
        dataKey="id"
      >
        <Column expander={allowExpansionSon} style={{ width: "5rem" }} />
        <Column field="eventName" header="Evento" sortable />
        <Column field="eventDescription" header="Descripción" sortable />
        <Column field="cityName" header="Ciudad" sortable />
        <Column field="adressDesciption" header="Dirección" sortable />
        <Column
          field="eventStartDate"
          header="Fecha Inicio"
          body={fechaStartEventTemplate}
          sortable
        />
        <Column
          field="eventEndDate"
          header="Fecha Fin"
          body={fechaEndEventTemplate}
          sortable
        />
        <Column field="eventHourStart" header="Hora Inicio" sortable />
        {/* <Column field="genderAllow" header="Género del Evento" body={genderEventTemplate} sortable /> */}
        <Column
          headerStyle={{ width: "4rem" }}
          body={unsubscribeUserFromEventTemplate}
        />
      </DataTable>
    );
  };
  const rowExpansionTemplateSon = (data) => {
    return (
      <DataTable
        value={data.proofs}
        expandedRows={expandedRowsGrandSon}
        onRowToggle={(e) => setExpandedRowsGrandSon(e.data)}
        rowExpansionTemplate={rowExpansionTemplateGrandSon}
        dataKey="id"
      >
        <Column expander={allowExpansionGrandSon} style={{ width: "5rem" }} />
        <Column field="proofName" header="Prueba" sortable />
      </DataTable>
    );
  };
  const rowExpansionTemplateGrandSon = (d) => {
    return (
      <DataTable value={d.competences}>
        <Column field="competenceName" header="Prueba Especial" sortable />
      </DataTable>
    );
  };
  const deleteEnrollUserFromEvent = async (e) => {
    // console.log('deleteEnrollUserFromEvent', e.id, e.idUser);
    await requestValdationToken(
      `User/UserUnsubscribeEvent/${e.idUser}/${e.id}`,
      {},
      "delete"
    )
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setShowToast(true);
          loadUserEventDetails();
          setReembolsar(res.data.result?.totalPayValue);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR User Unsubscribe Event", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  const unsubscribeUserFromEventTemplate = (rowData) => (
    <UnsubscribeUserFromEvent
      data={rowData}
      onAction={deleteEnrollUserFromEvent}
    />
  );
  // const unsubscribeUserTemplate = (rowData) => <UnsubscribeUserFromEvent data={rowData} onAction={deleteEnrollUser} />;

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button
        className="p-button-sm p-button-raised"
        icon="pi pi-plus"
        label="Expandir todo"
        onClick={expandAll}
        text
      />
      <Button
        className="p-button-sm p-button-raised"
        icon="pi pi-minus"
        label="Colapsar todo"
        onClick={collapseAll}
        text
      />
    </div>
  );
  const fechaNacimientoTemplate = (rowData) => (
    <span>{moment(rowData.birthDate).format("DD/MM/YYYY")}</span>
  );
  const fechaStartEventTemplate = (rowData) => (
    <span>{moment(rowData.eventStartDate).format("DD/MM/YYYY")}</span>
  );
  const fechaEndEventTemplate = (rowData) => (
    <span>{moment(rowData.eventEndDate).format("DD/MM/YYYY")}</span>
  );
  // const genderEventTemplate = (rowData) => <span>{rowData.genderAllow === 1 ? 'SOLO HOMBRES' : rowData.genderAllow === 2 ? 'SOLO MUJERES' : 'AMBOS SEXOS'}</span>

  const countryBodyTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <picture>
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country?.toString().toLowerCase()}`}
          style={{ width: "24px" }}
        />
      </picture>
      <span>
        {rowData.country &&
          rowData.country !== "" &&
          countries.find((x) => x.value === rowData.country).label}
      </span>
    </div>
  );

  /* const deleteEnrollUser = async (e) => {
    // console.log('deleteEnrollUserFromEvent', e.id, e.idUser);
    const data = [{
      userId: e.idUser,
      eventId: e.id,
      positionEvent: 0,
      statusInscription: 0,
      statusEquipment: 0,
      usercategoryId: 1
    }];
    await requestValdationToken("Event/users-unregister-event", data, "post")
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setShowToast(true);
          loadUserEventDetails();
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get User Events Details", err);
        // setMsgErrorLogin(err.response.data)
      });
  } */

  return (
    <>
      {session && (
        <>
          <div className="row justify-content-center">
            <div className="col-xl-11 col-sm-12">
              <h2 className="text-center">
                DEPORTISTAS INSCRITOS EN NUESTROS EVENTOS
              </h2>
              <div className="card">
                <DataTable
                  value={userEvents}
                  expandedRows={expandedRows}
                  onRowToggle={(e) => setExpandedRows(e.data)}
                  rowExpansionTemplate={rowExpansionTemplate}
                  dataKey="id"
                  header={header}
                  loading={loading}
                  // rowHover={true}
                  style={{ minWidth: "100%", cursor: "pointer" }}
                  emptyMessage="No existen usuarios inscritos en eventos"
                >
                  <Column expander={allowExpansion} style={{ width: "5rem" }} />
                  <Column
                    field="firstName"
                    header="Nombres"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="lastName"
                    header="Apellidos"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="userName"
                    header="Nombre en Aname"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="email"
                    header="Correo Electrónico"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="country"
                    header="País"
                    body={countryBodyTemplate}
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="phone"
                    header="Teléfono"
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                  <Column
                    field="birthDate"
                    header="Fecha de Nacimiento"
                    body={fechaNacimientoTemplate}
                    sortable
                    style={{ minWidth: "15rem" }}
                  />
                </DataTable>
              </div>
            </div>
          </div>
          {showToast && (
            <ToastNotification
              summary={`ANULAR INSCRIPCIÓN DE COMPETENCIA`}
              detail={`Se anuló correctamente la inscripción. Se debe reembolsar al deportista la cantidad de $${reembolsar}`}
              onActionClose={() => setShowToast(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Atletas;
