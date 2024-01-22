import React, { useState, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import moment from "moment";
import { requestValdationToken } from "../../../utils/axios/axios";
import { ordenarFecha } from "../../../utils/constants/constants";
const CompetenciasUsuarios = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsSon, setExpandedRowsSon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserEventDetails = async () => {
    setLoading(true);
    await requestValdationToken(
      `User/GetUserEventsDetails/${localStorage.getItem("idUser")}`
    )
      .then((res) => {
        // console.log('res user events', res);
        if (res?.status === 200) {
          setLoading(false);
          setUserEvents(res.data[0]?.events?.sort(ordenarFecha));
        }
        if (res?.status === 204) setUserEvents([]);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get User Events Details", err);
        // setMsgErrorLogin(err.response.data)
      });
  }

  const expandAll = () => {
    let _expandedRows = {};

    userEvents.forEach((x) => (_expandedRows[`${x.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    return rowData.proofs.length > 0;
  };
  const allowExpansionSon = (rowData) => {
    return rowData.competences.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <DataTable
        value={data.proofs}
        expandedRows={expandedRowsSon}
        onRowToggle={(e) => setExpandedRowsSon(e.data)}
        rowExpansionTemplate={rowExpansionTemplateSon}
        dataKey="id">
        <Column expander={allowExpansionSon} style={{ width: '5rem' }} />
        <Column field="proofName" header="Prueba" sortable />
      </DataTable>
    );
  };

  const rowExpansionTemplateSon = (d) => {
    return (
      <DataTable value={d.competences}>
        <Column field="competenceName" header="Prueba Especial" sortable />
      </DataTable>
    );
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button className="p-button-sm p-button-raised" icon="pi pi-plus" label="Expandir todo" onClick={expandAll} text />
      <Button className="p-button-sm p-button-raised" icon="pi pi-minus" label="Colapsar todo" onClick={collapseAll} text />
    </div>
  );
  const fechaStartEventTemplate = (rowData) => <span>{moment(rowData.eventStartDate).format('DD/MM/YYYY')}</span>
  const fechaEndEventTemplate = (rowData) => <span>{moment(rowData.eventEndDate).format('DD/MM/YYYY')}</span>

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xl-11 col-sm-12">
          <h2 className="text-center">Mis Competencias</h2>
          <div className="card">
            <DataTable
              value={userEvents}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="id"
              loading={loading}
              emptyMessage='No te has inscrito en ninguna competencia'>
              <Column expander={allowExpansion} style={{ width: '5rem' }} />
              <Column field="eventName" header="Evento" sortable />
              <Column field="eventDescription" header="Descripción" sortable />
              <Column field="cityName" header="Ciudad" sortable />
              <Column field="adressDesciption" header="Dirección" sortable />
              <Column field="eventStartDate" header="Fecha Inicio" body={fechaStartEventTemplate} sortable />
              <Column field="eventEndDate" header="Fecha Fin" body={fechaEndEventTemplate} sortable />
              <Column field="eventHourStart" header="Hora Inicio" sortable />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompetenciasUsuarios;
