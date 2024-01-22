import React, { useState, useEffect, useContext, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { requestValdationToken } from "../../../utils/axios/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faEnvelope, faMars, faPhone, faVenus } from "@fortawesome/free-solid-svg-icons";
import UpdateStateUser from "../../../components/shared/UpdateStateUser";
import SessionContext from "../../../providers/sessioncontext";
import countryList from "react-select-country-list";
import { ordenar } from "../../../utils/constants/constants";
const Usuarios = () => {
  const { session, verifySessionToken } = useContext(SessionContext);
  const countries = useMemo(() => countryList().getData(), []);
  const [usuarios, setUsuarios] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    verifySessionToken();
    loadUsuarios();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadUsuarios = async () => {
    setLoading(true);
    await requestValdationToken(
      `${localStorage?.getItem('rolId') === '2' ?
        `User/GetAllUsers/${localStorage.getItem('email')}` :
        'User/GetAllUsers'}`)
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          setLoading(false);
          setUsuarios(res.data.result?.sort(ordenar));
        }
        if (res?.data?.statusCode === 204) setUsuarios([]);
        // console.log('res usuarios', res);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get All Users", err);
        // setMsgErrorLogin(err.response.data)
      });
  }
  const nameTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      {
        rowData.genderId !== '3' && <FontAwesomeIcon icon={rowData.genderId === '1' ? faMars : faVenus} />
      }
      <span>{rowData.lastName + ' ' + rowData.firstName}</span>
    </div>
  );
  const contactTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <FontAwesomeIcon icon={faAddressBook} />
      <span>{rowData.contact}</span>
    </div>
  );
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
  const emailTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <FontAwesomeIcon icon={faEnvelope} />
      <span className="text-primary">{rowData.email}</span>
    </div>
  );
  const phoneTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <FontAwesomeIcon icon={faPhone} />
      <span className="text-primary">{rowData.phone}</span>
    </div>
  );
  const phoneContactTemplate = (rowData) => (
    <div className="flex align-items-center gap-2">
      <FontAwesomeIcon icon={faPhone} />
      <span className="text-primary">{rowData.contactPhone}</span>
    </div>
  );
  const stateBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.state === 1,
          "text-red-500 pi-times-circle": rowData.state === 2,
        })}
      ></i>
    );
  };
  const isFederatedTemplate = (rowData) => {
    return (
      <>
        <i
          className={classNames("mr-2 text-green-500 pi ", {
            "pi-flag": rowData.isFederated === 1,
            "pi-flag-fill": rowData.isFederated === 2,
          })}
        ></i>
        <span>{rowData.isFederated === 1 ? 'No Federado' : 'Federado'}</span>
      </>
    );
  };
  const updateStateUser = async (e) => {
    if (e.state) {
      await requestValdationToken(
        `User/UpdateUserState/${e.email}/${e.state === 1 ? 2 : 1}`,
        {},
        "put"
      )
        .then((res) => {
          // console.log('res update state user', res.data)
          if (res?.data?.statusCode === 200) loadUsuarios();
        })
        .catch((err) => {
          console.error("[*] ========= [*] ERROR Update State User", err);
          // setMsgErrorLogin(err.response.data)
        });
    }
    if (e.isFederated) {
      await requestValdationToken(
        `User/UpdateUserIsFederated/${e.email}/${e.isFederated === 1 ? 2 : 1}`,
        {},
        "put"
      )
        .then((res) => {
          // console.log('res update state user', res.data)
          if (res?.data?.statusCode === 200) loadUsuarios();
        })
        .catch((err) => {
          console.error("[*] ========= [*] ERROR Update User Is Federated", err);
          // setMsgErrorLogin(err.response.data)
        });
    }
  }
  const actionTemplate = (rowData) => <UpdateStateUser data={rowData} onAction={updateStateUser} />;
  function rowClassName(rowData) {
    if (
      Object.entries(rowData).some(([key, value]) => {
        return key !== 'conntryName' && (value === null || value === '');
      })
    ) {
      return 'bg-gray-200';
    }
    return '';
  }
  const footer = <div className="bg-gray-200 p-2">Los usuarios que tienen fondo gris no han actualizado los datos de su cuenta.</div>;
  return (
    <>
      {
        session &&
        <div className="row justify-content-center">
          <h2 className="text-center">USUARIOS ANAME</h2>
          <div className="col-12">
            <div className="card">
              <DataTable
                value={usuarios}
                paginator={usuarios?.length > 10}
                rows={10}
                stripedRows
                dataKey="id"
                loading={loading}
                size="small"
                emptyMessage="No existen usuarios."
                scrollable
                // className="p-datatable-sm"
                rowHover={true}
                style={{ minWidth: "100%", cursor: "pointer" }}
                rowClassName={rowClassName}
                footer={footer}
              >
                <Column
                  field="firstName"
                  header="Nombre"
                  style={{ minWidth: "12rem" }}
                  body={nameTemplate} />
                <Column
                  field="userName"
                  header="UserName"
                  style={{ minWidth: "12rem" }} />
                <Column
                  field="countryName"
                  header="País"
                  style={{ minWidth: "12rem" }}
                  body={countryBodyTemplate}
                />
                <Column
                  field="provice"
                  header="Provincia"
                  style={{ minWidth: "12rem" }}
                />
                <Column
                  field="city"
                  header="Ciudad"
                  style={{ minWidth: "12rem" }}
                />
                <Column
                  field="email"
                  header="Correo electrónico"
                  style={{ minWidth: "18rem" }}
                  body={emailTemplate} />
                <Column
                  field="phone"
                  header="Teléfono"
                  style={{ minWidth: "12rem" }}
                  body={phoneTemplate} />
                <Column
                  field="contact"
                  header="Contacto"
                  style={{ minWidth: "12rem" }}
                  body={contactTemplate} />
                <Column
                  field="contactPhone"
                  header="# Contacto"
                  style={{ minWidth: "12rem" }}
                  body={phoneContactTemplate} />
                <Column
                  field="isFederated"
                  header="Es Federado"
                  style={{ minWidth: "15rem" }}
                  body={isFederatedTemplate} />
                <Column
                  field="state"
                  header="Estado"
                  style={{ minWidth: "6rem" }}
                  body={stateBodyTemplate}
                />
                <Column
                  style={{ minWidth: "12rem" }}
                  body={actionTemplate}
                />
              </DataTable>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Usuarios;