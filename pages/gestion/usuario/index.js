import { Chart } from "primereact/chart";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Card } from "primereact/card";
import { ProductService } from "../../../mockups/services/ProductService";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/custom-animations/open-animation.css";
import { requestValdationToken } from "../../../utils/axios/axios";
import NotificacionDeUsuario from "../../../components/shared/NotificacionDeUsuario";
import { styled } from "styled-components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import ToastNotification from "../../../components/shared/ToastNotification";
// import Evento from '../../../components/shared/Evento';
import Competencia from "../../../components/shared/Evento";
import CompetenciasUsuarios from "../../../components/shared/CompetenciasUsuarios";
import { MultiSelect } from "primereact/multiselect";
import UploadFile from "../../../components/shared/UploadFile";
import { baseURL } from "../../../utils/axios/axios";
import SessionContext from "../../../providers/sessioncontext";
const Usuario = () => {
  const { session, verifySessionToken } = useContext(SessionContext);
  const toast = useRef(null);
  const [activeIndexMain, setActiveIndexMain] = useState(0);
  const [dataUser, setDataUser] = useState(null);
  const [options, setOptions] = useState({});
  const [data, setChartData] = useState({});
  // const { layoutConfig } = useContext(LayoutContext);
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");

  // NOTIFICACIONES
  const [activeIndexNotification, setActiveIndexNotification] = useState(0);
  const [notificacionesPending, setNotificacionesPending] = useState([]);
  const [notificacionesApproved, setNotificacionesApproved] = useState([]);
  const [notificacionesRejected, setNotificacionesRejected] = useState([]);
  const [crearNotificacion, setCrearNotificacion] = useState(false);
  const [valueTitulo, setValueTitulo] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  // NOTIFICACIONES

  // INSCRIPCIONES
  // const [activeIndexInscripciones, setActiveIndexInscripciones] = useState(0);
  const [eventsWithProofs, setEventsWithProofs] = useState([]);
  const [competencesFromEvent, setCompetencesFromEvent] = useState([]);
  const [eventsUserEnrolled, setEventsUserEnrolled] = useState([]);
  const [selectedEventToEnroll, setSelectedEventToEnroll] = useState(null);
  const [selectedCompetencesToEnroll, setSelectedCompetencesToEnroll] =
    useState([]);
  const [selectedCompetencesToShow, setSelectedCompetencesToShow] = useState(
    []
  );
  const [showToast, setShowToast] = useState(false);
  const [subscribingToCompetence, setSubscribingToCompetences] =
    useState(false);
  const [valueInscription, setValueInscription] = useState(null);
  // INSCRIPCIONES

  // COMPROBANTES DE PAGO
  const [imgComprobantePago, setImgComprobantePago] = useState(null);
  const [urlComprobantePago, setUrlComprobantePago] = useState("");
  const [selectedEventToPay, setSelectedEventToPay] = useState(null);
  const [eventsToPay, setEventsToPay] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  // COMPROBANTES DE PAGO

  const [idDelete, setIdDelete] = useState(null);

  useEffect(() => {
    verifySessionToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // ProductService.getProductsData().then((data) => setProducts(data.slice(0, 12)));
    setProducts(ProductService.getProductsData().slice(0, 12));
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataUser && dataUser.genderId !== 3 && activeIndexMain === 1)
      loadListEventWithProofs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUser]);
  useEffect(() => {
    if (activeIndexMain === 0) loadNotifications();
    if (activeIndexMain === 1) {
      setSelectedEventToEnroll(null);
      setSelectedCompetencesToEnroll([]);
      loadDataUser();
    }
    if (activeIndexMain === 2) {
      setImgComprobantePago(null);
      setUrlComprobantePago("");
      getEventsAvailableToPay();
      setSelectedEventToPay(null);
    }
  }, [activeIndexMain]);

  const loadDataUser = async () => {
    await requestValdationToken(`User/GetUser/${localStorage.getItem("email")}`)
      .then((res) => {
        // console.log("res api user registered", res.data);
        if (res?.data?.statusCode === 200) setDataUser(res.data.result);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get User", err);
        // setMsgErrorLogin(err.response.data)
      });
  };

  // NOTIFICACIONES
  const loadNotifications = async () => {
    await requestValdationToken(
      `Notification/GetAllNotificationByUser/${localStorage.getItem("idUser")}`
    )
      .then((res) => {
        // console.log('res notificaciones 204', res)
        if (res?.status === 200) {
          if (res.data?.statusCode === 200) {
            // console.log('res notificaciones', res)
            setNotificacionesPending(res.data.result?.pending);
            setNotificacionesApproved(res.data.result?.approved);
            setNotificacionesRejected(res.data.result?.rejected);
          }
          if (res.data?.statusCode === 204) {
            // console.log('res notificaciones', res)
            setNotificacionesPending([]);
            setNotificacionesApproved([]);
            setNotificacionesRejected([]);
          }
        }
      })
      .catch((err) => {
        console.error(
          "[*] ========= [*] ERROR Get All Notifications By User",
          err
        );
        // setMsgErrorLogin(err.response.data)
      });
  };

  const createNotification = async () => {
    const data = {
      title: valueTitulo,
      description: valueDesc,
      state: 0,
      email: localStorage.getItem("email"),
      idUser: localStorage.getItem("idUser"),
    };
    await requestValdationToken("Notification/CreateNotification", data, "post")
      .then((res) => {
        loadNotifications();
        setValueTitulo("");
        setValueDesc("");
        setCrearNotificacion(false);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Create Notification", err);
        // setMsgErrorLogin(err.response.data)
      });
  };

  const deleteNotificationById = async (id) => {
    // console.log('id delete', id);
    await requestValdationToken(
      `Notification/DeleteNotification/${id}`,
      {},
      "put"
    )
      .then((res) => {
        // console.log('res delete noti', res);
        if (res?.status === 200 || res?.status === 204) {
          loadNotifications();
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Delete Notification By Id", err);
        // setMsgErrorLogin(err.response.data)
      });
  };

  const confirmDelete = (value) => {
    toast.current.show({
      severity: "info",
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
            <div className="font-bold text-xl my-3">
              Estás seguro de borrar la notificación?
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                toast.current.clear();
                deleteNotificationById(value);
              }}
              type="button"
              label="Confirmar"
              className="customButtonConfirmLogout p-button-sm p-button-rounded p-button-raised w-full"
            />
            <Button
              onClick={(e) => toast.current.clear()}
              type="button"
              label="Cancelar"
              className="customButtonCancelLogout p-button-sm p-button-rounded p-button-raised w-full"
            />
          </div>
        </div>
      ),
    });
  };

  const beginAction = (e) => {
    if (e?.act === "delete") confirmDelete(e.data);
    else editNotification(e.data);
  };

  const editNotification = async (data) => {
    // console.log('e beginact DATA', data)
    const info = {
      id: data.id,
      title: data.title,
      description: data.description,
      state: data.state,
      email: data.email,
      userId: data.userId,
      updateDate: moment(),
      status: "U",
    };
    await requestValdationToken("Notification/EditNotification", info, "put")
      .then((res) => {
        if (res?.status === 200) {
          loadNotifications();
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Edit Notification", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  // NOTIFICACIONES

  // INSCRIPCIONES
  const loadListEventWithProofs = async () => {
    // console.log('lit events', dataUser)
    await requestValdationToken(
      `Event/GetEventsWithProofsUnByeUserId?userId=${localStorage.getItem(
        "idUser"
      )}`
    )
      .then((res) => {
        if (res?.data?.statusCode === 200) setEventsWithProofs(res.data.result);
        if (res?.data?.statusCode === 204) setEventsWithProofs([]);
      })
      .catch((err) => {
        console.error(
          "[*] ========= [*] ERROR Get Events With Proofs By User",
          err
        );
        // setMsgErrorLogin(err.response.data)
      });
  };
  const loadCompetencesFromEvent = async (event) => {
    await requestValdationToken(`Proof/GetProofsByEventId/${event.id}`)
      .then((res) => {
        if (res?.data?.statusCode === 200)
          setCompetencesFromEvent(res.data.result);
        if (res?.data?.statusCode === 204) setCompetencesFromEvent([]);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get Proofs By Id Event", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  const calculateCostInscription = async () => {
    const tmp = [];
    selectedCompetencesToEnroll.forEach((x) => {
      tmp.push(x.id);
      setSelectedCompetencesToShow((list) => list.concat(x.proofName));
    });
    const data = {
      userId: Number(localStorage.getItem("idUser")),
      proofIds: tmp,
      eventId: selectedEventToEnroll.id,
    };
    await requestValdationToken(`User/PreviewUserSubscribeProof`, data, "post")
      .then((res) => {
        // console.log(res)
        if (res?.data?.statusCode === 200) setValueInscription(res.data.result);
      })
      .catch((err) => {
        console.error(
          "[*] ========= [*] ERROR User Preview Subscribe Proof",
          err
        );
        // setMsgErrorLogin(err.response.data)
      });
  };
  const enrollToCompetences = async () => {
    setSubscribingToCompetences(true);
    const tmp = [];
    selectedCompetencesToEnroll.forEach((x) => tmp.push(x.id));
    const data = {
      userId: Number(localStorage.getItem("idUser")),
      proofIds: tmp,
      eventId: selectedEventToEnroll.id,
    };
    await requestValdationToken(`User/UserSubscribeProof`, data, "post")
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          loadListEventWithProofs();
          setSubscribingToCompetences(false);
          setSelectedEventToEnroll(null);
          setSelectedCompetencesToEnroll([]);
          setValueInscription(null);
          setSelectedCompetencesToShow([]);
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR User Subscribe Proof", err);
        // setMsgErrorLogin(err.response.data)
      });
  };
  /* const loadEventsUserEnrolled = async () => {
        await requestValdationToken(`Event/GetAllEvents/${localStorage.getItem('idUser')}`).then(res => {
            if (res.data.statusCode === 200) setEventsUserEnrolled(res.data.result);
        })
    } */
  // INSCRIPCIONES

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };
  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor =
      documentStyle.getPropertyValue("--text-color") || "#495057";
    const textColorSecondary =
      documentStyle.getPropertyValue("--text-color-secondary") || "#6c757d";
    const surfaceBorder =
      documentStyle.getPropertyValue("--surface-border") || "#dfe7ef";
    const barData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor:
            documentStyle.getPropertyValue("--primary-500") || "#6366f1",
          borderColor:
            documentStyle.getPropertyValue("--primary-500") || "#6366f1",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          backgroundColor:
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          borderColor:
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          data: [28, 48, 40, 19, 86, 27, 90],
        },
      ],
    };

    const barOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: "500",
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          border: {
            display: false,
          },
        },
      },
    };

    const pieData = {
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue("--indigo-500") || "#6366f1",
            documentStyle.getPropertyValue("--purple-500") || "#a855f7",
            documentStyle.getPropertyValue("--teal-500") || "#14b8a6",
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--indigo-400") || "#8183f4",
            documentStyle.getPropertyValue("--purple-400") || "#b975f9",
            documentStyle.getPropertyValue("--teal-400") || "#41c5b7",
          ],
        },
      ],
    };

    const pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };

    const lineData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor:
            documentStyle.getPropertyValue("--primary-500") || "#6366f1",
          borderColor:
            documentStyle.getPropertyValue("--primary-500") || "#6366f1",
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor:
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          borderColor:
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          tension: 0.4,
        },
      ],
    };

    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          border: {
            display: false,
          },
        },
      },
    };

    const polarData = {
      datasets: [
        {
          data: [11, 16, 7, 3],
          backgroundColor: [
            documentStyle.getPropertyValue("--indigo-500") || "#6366f1",
            documentStyle.getPropertyValue("--purple-500") || "#a855f7",
            documentStyle.getPropertyValue("--teal-500") || "#14b8a6",
            documentStyle.getPropertyValue("--orange-500") || "#f97316",
          ],
          label: "My dataset",
        },
      ],
      labels: ["Indigo", "Purple", "Teal", "Orange"],
    };

    const polarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    const radarData = {
      labels: [
        "Eating",
        "Drinking",
        "Sleeping",
        "Designing",
        "Coding",
        "Cycling",
        "Running",
      ],
      datasets: [
        {
          label: "My First dataset",
          borderColor:
            documentStyle.getPropertyValue("--indigo-400") || "#8183f4",
          pointBackgroundColor:
            documentStyle.getPropertyValue("--indigo-400") || "#8183f4",
          pointBorderColor:
            documentStyle.getPropertyValue("--indigo-400") || "#8183f4",
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor:
            documentStyle.getPropertyValue("--indigo-400") || "#8183f4",
          data: [65, 59, 90, 81, 56, 55, 40],
        },
        {
          label: "My Second dataset",
          borderColor:
            documentStyle.getPropertyValue("--purple-400") || "#b975f9",
          pointBackgroundColor:
            documentStyle.getPropertyValue("--purple-400") || "#b975f9",
          pointBorderColor:
            documentStyle.getPropertyValue("--purple-400") || "#b975f9",
          pointHoverBackgroundColor: textColor,
          pointHoverBorderColor:
            documentStyle.getPropertyValue("--purple-400") || "#b975f9",
          data: [28, 48, 40, 19, 96, 27, 100],
        },
      ],
    };

    const radarOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary,
          },
        },
      },
    };

    setOptions({
      barOptions,
      pieOptions,
      lineOptions,
      polarOptions,
      radarOptions,
    });
    setChartData({
      barData,
      pieData,
      lineData,
      polarData,
      radarData,
    });
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const itemTemplate = (product, layout) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product);
    else if (layout === "grid") return gridItem(product);
  };

  /* const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    }; */

  const listItem = (product) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <picture>
            <img
              className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
              src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
              alt={product.name}
            />
          </picture>
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">{product.name}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product.category}</span>
                </span>
                <Tag
                  value={product.inventoryStatus}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${product.price}</span>
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded"
                disabled={product.inventoryStatus === "OUTOFSTOCK"}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product) => {
    return (
      <div className="col-xl-4 col-md-6 col-sm-12 p-2">
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{product.category}</span>
            </div>
            <Tag
              value={product.inventoryStatus}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <picture>
              <img
                className="w-9 shadow-2 border-round"
                src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
                alt={product.name}
              />
            </picture>
            <div className="text-2xl font-bold">{product.name}</div>
            <Rating value={product.rating} readOnly cancel={false}></Rating>
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${product.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              disabled={product.inventoryStatus === "OUTOFSTOCK"}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  // COMPROBANTE DE PAGO
  const getEventsAvailableToPay = async () => {
    await requestValdationToken(
      `Event/GetEventsWithProofsByeUserId?userId=${localStorage.getItem(
        "idUser"
      )}`
    )
      .then((res) => {
        // console.log('+++++ res', res);
        if (res?.data?.statusCode === 200) setEventsToPay(res.data.result);
        if (res?.status === 204) setEventsToPay([]);
      })
      .catch((err) => {
        console.error(
          "[*] ========= [*] ERROR Get Events With Proofs By Id User",
          err
        );
        // setMsgErrorLogin(err.response.data)
      });
  };
  const onFilesUpload = (event) => {
    event.forEach(async (file, i) => {
      setImgComprobantePago(file);
      setUrlComprobantePago(URL.createObjectURL(file));
      // uploadImage();
    });
  };

  const uploadImage = async (file) => {
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("DocumentFile", file);
    formData.append("DocumentTypeId", 3);
    formData.append("DocumentIdentifier", selectedEventToPay.id);
    formData.append("OriginDocument", "pago");
    formData.append("UserId", Number(localStorage.getItem("idUser")));
    const headers = {
      Authorization: localStorage.getItem("token"),
    };
    await fetch(`${baseURL}/Document/UploadDocument`, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((res) => {
        // console.log('res UPLOADFILE OK', res);
        setUploadingDoc(false);
        setShowToast(true);
        setSelectedEventToPay(null);
        setImgComprobantePago(null);
        setUrlComprobantePago("");
        getEventsAvailableToPay();
      })
      .catch((err) => {
        console.error(
          "[*] ===========> [*] ERROR Subiendo documentos ========> ",
          err
        );
        return;
      });
  };
  // COMPROBANTE DE PAGO

  return (
    <>
      {session && (
        <>
          <Toast
            ref={toast}
            className="toastCustomConfirmLogout"
            position="top-center"
          />
          <TabView
            activeIndex={activeIndexMain}
            onTabChange={(e) => setActiveIndexMain(e.index)}
          >
            <TabPanel header="Solicitudes" leftIcon="pi pi-pencil mr-2">
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                  <Card>
                    <div className="row justify-content-center p-fluid">
                      {!crearNotificacion ? (
                        <div className="col-xl-2 col-lg-3 col-md-5 col-sm-6 text-center">
                          <Button
                            label="Crear Solicitud"
                            icon="pi pi-plus"
                            className="p-button-sm p-button-raised"
                            onClick={() => setCrearNotificacion(true)}
                          />
                        </div>
                      ) : (
                        <div className="col-xl-6 col-lg-8 col-md-10 col-sm-12">
                          <Card>
                            <InputText
                              className="w-100 mb-2"
                              placeholder="Titulo"
                              value={valueTitulo}
                              onChange={(e) => setValueTitulo(e.target.value)}
                            />
                            <InputTextarea
                              className="w-100"
                              placeholder="Descripción..."
                              value={valueDesc}
                              onChange={(e) => setValueDesc(e.target.value)}
                              rows={5}
                              cols={30}
                            />
                            <ContainerButtonsNotifications>
                              <ContainerButtonNotifications>
                                <Button
                                  label="Crear"
                                  icon="pi pi-check"
                                  className="p-button-sm p-button-raised"
                                  onClick={createNotification}
                                  disabled={
                                    valueTitulo === "" || valueDesc === ""
                                  }
                                />
                              </ContainerButtonNotifications>
                              <ContainerButtonNotifications>
                                <Button
                                  label="Cancelar"
                                  icon="pi pi-ban"
                                  className="p-button-sm p-button-raised p-button-danger"
                                  onClick={() => {
                                    setCrearNotificacion(false);
                                    setValueTitulo("");
                                    setValueDesc("");
                                  }}
                                />
                              </ContainerButtonNotifications>
                            </ContainerButtonsNotifications>
                          </Card>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                  <Card>
                    <h3 className="text-center">Solicitudes</h3>
                    <TabView
                      activeIndex={activeIndexNotification}
                      onTabChange={(e) => setActiveIndexNotification(e.index)}
                    >
                      <TabPanel
                        header="Abiertas"
                        leftIcon="pi pi-exclamation-circle mr-2"
                      >
                        <div className="row justify-content-center">
                          {notificacionesPending.length > 0 ? (
                            notificacionesPending.map((el, index) => (
                              <div className="col-12" key={index}>
                                <NotificacionDeUsuario
                                  el={el}
                                  onAction={beginAction}
                                  criterio="Crear"
                                />
                              </div>
                            ))
                          ) : (
                            <p
                              className="font-bold"
                              style={{ color: "var(--secondary-color)" }}
                            >
                              No existen Solicitudes Abiertas.
                            </p>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel
                        header="Aprobadas"
                        leftIcon="pi pi-check-circle mr-2"
                      >
                        <div className="row justify-content-center">
                          {notificacionesApproved.length > 0 ? (
                            notificacionesApproved.map((el, index) => (
                              <div className="col-12" key={index}>
                                <NotificacionDeUsuario
                                  el={el}
                                  onAction={beginAction}
                                  severity={"A"}
                                />
                              </div>
                            ))
                          ) : (
                            <p
                              className="font-bold"
                              style={{ color: "var(--secondary-color)" }}
                            >
                              No existen Solicitudes Aprobadas.
                            </p>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel header="Rechazadas" leftIcon="pi pi-times mr-2">
                        <div className="row justify-content-center">
                          {notificacionesRejected.length > 0 ? (
                            notificacionesRejected.map((el, index) => (
                              <div className="col-12" key={index}>
                                <NotificacionDeUsuario
                                  el={el}
                                  onAction={beginAction}
                                  severity={"R"}
                                />
                              </div>
                            ))
                          ) : (
                            <p
                              className="font-bold"
                              style={{ color: "var(--secondary-color)" }}
                            >
                              No existen Solicitudes Negadas.
                            </p>
                          )}
                        </div>
                      </TabPanel>
                    </TabView>
                  </Card>
                </div>
              </div>
              {activeIndexMain === 0 && showToast && (
                <ToastNotification
                  summary={`Solicitud de Usuario`}
                  detail={"La solicitud fue eliminada exitosamente"}
                  onActionClose={() => setShowToast(false)}
                />
              )}
            </TabPanel>
            <TabPanel header="Inscripciones" leftIcon="pi pi-check mr-2">
              {dataUser?.genderId === 3 || eventsWithProofs.length !== 0 ? (
                <div className="row justify-content-center mb-3">
                  <div className="col-xl-4 col-lg-6 col-md-9 col-sm-12 text-center">
                    <Card>
                      <div className="row">
                        <div className="col-12">
                          <h6 className="text-left text-primary">Eventos</h6>
                          <Dropdown
                            value={selectedEventToEnroll}
                            onChange={(e) => {
                              setSelectedEventToEnroll(e.value);
                              setValueInscription(null);
                              setSelectedCompetencesToShow([]);
                              loadCompetencesFromEvent(e.value);
                            }}
                            options={eventsWithProofs}
                            optionLabel="eventName"
                            placeholder="Selecciona un Evento"
                            className="w-full"
                          />
                        </div>
                        {selectedEventToEnroll && (
                          <>
                            <p className="text-center text-primary mb-0">
                              Puedes inscribirte hasta en{" "}
                              <b>
                                {selectedEventToEnroll.proofLimit} competencia
                                {selectedEventToEnroll.proofLimit !== 1
                                  ? "s"
                                  : ""}
                              </b>
                            </p>
                            <div className="col-12">
                              <hr />
                              <h6 className="text-left text-primary">
                                Competencias
                              </h6>
                              <MultiSelect
                                id="competences"
                                value={selectedCompetencesToEnroll}
                                onChange={(e) =>
                                  setSelectedCompetencesToEnroll(e.value)
                                }
                                options={competencesFromEvent}
                                optionLabel="proofName"
                                selectionLimit={
                                  selectedEventToEnroll.proofLimit
                                }
                                className="w-100"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {selectedEventToEnroll &&
                        selectedCompetencesToEnroll.length <=
                          selectedEventToEnroll.proofLimit && (
                          <div className="row">
                            <p className="text-center text-danger">
                              Después de inscribirte no podrás agregar ni quitar
                              competencias
                            </p>
                            <hr />
                            <div className="col-12 text-center">
                              <Button
                                label="Calcular Pago"
                                icon="pi pi-calculator"
                                disabled={
                                  selectedCompetencesToEnroll.length === 0
                                }
                                className="p-button-sm p-button-raised p-button-outlined"
                                onClick={calculateCostInscription}
                              />
                            </div>
                            {valueInscription && (
                              <>
                                <div className="col-12">
                                  <ContainerValueInscription>
                                    <h6 className="text-left">
                                      Competencias seleccionadas:
                                    </h6>
                                    <ul>
                                      {selectedCompetencesToShow?.length > 0 &&
                                        selectedCompetencesToShow.map(
                                          (el, i) => <li key={i}>{el}</li>
                                        )}
                                    </ul>
                                    <hr />
                                    <span>
                                      <b>Numero de competencias:</b>{" "}
                                      {valueInscription.proofsNumber}
                                    </span>
                                    <span>
                                      <b>Total a pagar:</b> $
                                      {valueInscription.totalPay}
                                    </span>
                                  </ContainerValueInscription>
                                </div>

                                <div className="col-12 text-center">
                                  <Button
                                    label="Inscribirme"
                                    icon={`pi pi-${
                                      subscribingToCompetence
                                        ? "spin pi-spinner"
                                        : "check"
                                    }`}
                                    className="p-button-sm p-button-raised"
                                    onClick={enrollToCompetences}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      {activeIndexMain === 1 && showToast && (
                        <ToastNotification
                          summary={`Inscripción`}
                          detail={"Tu inscripción se realizó exitosamente"}
                          onActionClose={() => setShowToast(false)}
                        />
                      )}
                    </Card>
                  </div>
                </div>
              ) : (
                <p className="text-center text-primary">
                  No existen eventos disponibles para que te puedas inscribir
                </p>
              )}
              {eventsUserEnrolled?.length > 0 &&
                eventsUserEnrolled.map((el, index) => (
                  <div
                    className="row justify-content-center align-items-center"
                    key={index}
                  >
                    <div className="col-xl-6 col-lg-8 col-md-10 col-sm-12">
                      <h3 className="text-center">Mis Competencias</h3>
                      {/* <Evento data={el} rol={'D'} key={index} className="mb-2" /> */}
                      <Competencia data={el} key={index} className="mb-2" />
                    </div>
                  </div>
                ))}
            </TabPanel>
            <TabPanel
              header="Subir Comprobantes de Pago"
              leftIcon="pi pi-money-bill mr-2"
            >
              <div className="row justify-content-center mt-3">
                <div className="col-xl-8 col-lg-9 col-md-12 text-center">
                  <h6 className="text-center text-primary">Subir Documento</h6>
                  <Card>
                    <h6 className="text-left text-primary">Eventos</h6>
                    <div className="row justify-content-start">
                      <div className="col-xl-4 col-lg-6 col-md-8 col-sm-12">
                        <Dropdown
                          value={selectedEventToPay}
                          onChange={(e) => {
                            setSelectedEventToPay(e.value);
                            setImgComprobantePago(null);
                            setUrlComprobantePago("");
                          }}
                          options={eventsToPay}
                          optionLabel="eventName"
                          placeholder="Selecciona un Evento"
                          className="w-full"
                          emptyMessage="Sin pendientes de subir comprobante"
                        />
                      </div>
                    </div>

                    <hr />
                    {selectedEventToPay && (
                      <UploadFile onUpload={onFilesUpload} />
                    )}

                    {imgComprobantePago && urlComprobantePago !== "" && (
                      <>
                        <hr />
                        <h6 className="text-center text-primary">
                          Preview del Documento
                        </h6>
                        <div className="row justify-content-center">
                          <div className="col-12">
                            <picture>
                              <img
                                src={urlComprobantePago}
                                alt="Preview"
                                width="500"
                              />
                            </picture>
                          </div>
                          <div className="col-12">
                            <Button
                              onClick={() => uploadImage(imgComprobantePago)}
                              type="button"
                              icon={`pi pi-${
                                uploadingDoc ? "spin pi-spinner" : "upload"
                              }`}
                              label="Subir Documento"
                              className="p-button-sm p-button-raised"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </Card>
                  {activeIndexMain === 2 && showToast && (
                    <ToastNotification
                      summary={`Comprobante de Pago`}
                      detail={"Tu comprobante de pago se envió exitosamente"}
                      onActionClose={() => setShowToast(false)}
                    />
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel header="Competencias" leftIcon="pi pi-th-large mr-2">
              <CompetenciasUsuarios />
            </TabPanel>
          </TabView>
          {/* <div className="row justify-content-center align-items-center mb-3">
                    <div className="col-xl-6 col-lg-7 col-md-9 col-sm-12">
                        <Card>
                            <h3 className="text-center">PRÓXIMOS EVENTOS</h3>
                            <AwesomeSlider animation="openAnimation" className="mb-3">
                                <div data-src="/assets/images/uno.jpg" />
                                <div data-src="/assets/images/dos.jpg" />
                                <div data-src="/assets/images/tres.jpg" />
                            </AwesomeSlider>
                        </Card>
                    </div>
                </div> */}
          {/* <div className='row justify-content-center mb-3'>
                    <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                        <Card>
                            <h3 className='text-center'>ULTIMOS EVENTOS EN LOS QUE HAS PARTICIPADO</h3>
                            <DataView value={products} itemTemplate={itemTemplate} layout={layout} />
                        </Card>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                    <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                        <Card>
                            <h3 className='text-center'>ESTADÍSTICAS DE TUS PARTICIPACIONES</h3>
                            <div className="row p-fluid">
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card">
                                        <h5>Marcas por prueba</h5>
                                        <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card">
                                        <h5>Relación Género-Disciplina</h5>
                                        <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Edades</h5>
                                        <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Competidores por Categoría</h5>
                                        <Chart type="doughnut" data={data.pieData} options={options.pieOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Polar Area Chart</h5>
                                        <Chart type="polarArea" data={data.polarData} options={options.polarOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Radar Chart</h5>
                                        <Chart type="radar" data={data.radarData} options={options.radarOptions}></Chart>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                    <div className="col-xl-9 col-lg-10 col-md-11 col-sm-12">
                        <Card>
                            <h3 className='text-center'>ESTADÍSTICAS DE TUS EQUIPOS</h3>
                            <div className="row p-fluid">
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card">
                                        <h5>Marcas por prueba</h5>
                                        <Chart type="line" data={data.lineData} options={options.lineOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card">
                                        <h5>Relación Género-Disciplina</h5>
                                        <Chart type="bar" data={data.barData} options={options.barOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Edades</h5>
                                        <Chart type="pie" data={data.pieData} options={options.pieOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Competidores por Categoría</h5>
                                        <Chart type="doughnut" data={data.pieData} options={options.pieOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Polar Area Chart</h5>
                                        <Chart type="polarArea" data={data.polarData} options={options.polarOptions}></Chart>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-sm-12">
                                    <div className="card flex flex-column align-items-center">
                                        <h5 className="text-left w-full">Radar Chart</h5>
                                        <Chart type="radar" data={data.radarData} options={options.radarOptions}></Chart>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div> */}
        </>
      )}
    </>
  );
};

export default Usuario;

const ContainerButtonsNotifications = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;
const ContainerButtonNotifications = styled.div`
  padding-inline: 0.25rem;
`;

const ContainerValueInscription = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  padding: var(--inline-spacing);
  border-radius: var(--border-radius);
  background: var(--primary-color);
  h6 {
    color: var(--primary-color-text);
  }
  hr {
    color: var(--primary-color-text);
  }
  span {
    display: block;
    color: var(--primary-color-text);
  }
  ul > li {
    text-align: left;
    color: var(--primary-color-text);
  }
`;
