import React, { useEffect, useRef, useState } from 'react';
import AprobarInscripcion from '../AprobarInscripcion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const TablaInscritos = ({ data, event, onAction, approveFinish = false, loading }) => {
    const [approvingInscription, setApprovingInscription] = useState(false);
    useEffect(() => {
        if (approveFinish) setApprovingInscription(false);
    }, [approveFinish]);
    const valorPagadotemplate = (rowData) => <span className='font-bold'>
        ${rowData.events[0].proofs[0].totalPayValue}
    </span>;
    const proofsTemplate = (rowData) => <span>
        <ul>
            {
                rowData.events[0].proofs?.map((el, i) => (
                    <li key={i}>{el.proofName}</li>
                ))
            }
        </ul>
    </span>;
    const actionsTemplate = (rowData) => <AprobarInscripcion
        user={rowData}
        event={event}
        onActionApprove={startApprove}
        approvingInscription={approvingInscription}
    />;
    const startApprove = async (e) => {
        setApprovingInscription(true);
        const data = {
            paymentValue: e.user.events[0].proofs[0].totalPayValue,
            userId: e.user.id,
            documentId: e.idDoc,
            eventId: e.event.id,
        };
        onAction({ data });
    };
    return (
        <>
            <DataTable
                value={data}
                paginator={data?.length > 10}
                rows={10}
                stripedRows
                dataKey="id"
                loading={loading}
                size="small"
                emptyMessage="No existen usuarios inscritos."
                scrollable
                // className="p-datatable-sm"
                rowHover={true}
                style={{ minWidth: "100%", cursor: "pointer" }}
            >
                <Column
                    field="firstName"
                    header="Nombres"
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="lastName"
                    header="Apellidos"
                    style={{ minWidth: "12rem" }}
                />
                <Column
                    field="userName"
                    header="UserName"
                    style={{ minWidth: "12rem" }} />
                <Column
                    field="events"
                    header="Valor Pagado"
                    style={{ minWidth: "12rem" }}
                    body={valorPagadotemplate} />
                <Column
                    field="events"
                    header="Pruebas"
                    style={{ minWidth: "12rem" }}
                    body={proofsTemplate}
                />
                <Column
                    field=""
                    header=""
                    style={{ minWidth: "12rem" }}
                    body={actionsTemplate}
                />
            </DataTable>
        </>
    );
};


export default TablaInscritos;
