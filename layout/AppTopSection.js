import React, { forwardRef, useContext, useState, useEffect } from "react";
import { LayoutContext } from "./contexto/layoutcontext";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper/core";
import { requestValdationToken } from "../utils/axios/axios";
import { EventContext } from "../providers/eventContext";
import { Tooltip } from "primereact/tooltip";

SwiperCore.use([Autoplay, Pagination, Navigation]);
// eslint-disable-next-line react/display-name
const AppTopSection = forwardRef((props, ref) => {
  const { chargeEvents } = useContext(EventContext);
  // const router = useRouter();
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const [eventsList, setEventsList] = useState([
    {
      eventName: "Evento 1",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 2",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 3",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 4",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 5",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 6",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 7",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
    {
      eventName: "Evento 8",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: "Quito",
    },
  ]);
  useEffect(() => {
    loadListEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (chargeEvents) loadListEvent();
  }, [chargeEvents]);
  const loadListEvent = async () => {
    await requestValdationToken("Event/GetAllEvents")
      .then((res) => {
        if (res?.data?.statusCode === 200) setEventsList(res.data.result);
      })
      .catch((err) => {
        console.error("[*] ========= [*] ERROR Get All Events", err);
      });
  };
  const extractHourEvent = (value) => {
    const partes = value.split(":");
    // Obtener las horas y minutos
    const horas = partes[0];
    const minutos = partes[1];
    return horas + ":" + minutos;
  };

  const productTemplate = (item, i) => {
    return (
      <SwiperSlide key={i}>
        <div
          className="top-section-card d-inline-block justify-content-center align-items-center border-1 border-dashed surface-border text-center w-100"
          style={{ height: "80px", verticalAlign: "middle", cursor: "pointer" }}
        >
          {item.eventName.length > 10 && <Tooltip target=".event-name" />}
          <p
            className="event-name m-0 text-red-600 font-bold text-xs"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            data-pr-tooltip={item.eventName}
            data-pr-position="bottom"
          >
            {item.eventName}
          </p>
          {/* <p className="m-0 text-blue-800 font-bold text-xs">{moment(item.eventStartDate).format('DD-MM-YY')}</p> */}
          <p className="m-0 text-blue-800 font-bold text-xs">
            {item.eventStartDate}
          </p>
          {/* <p className="m-0 font-bold text-xs">{moment(item.eventEndDate).format('DD-MM-YY')}</p> */}
          {/* <p className="m-0 text-blue-800 font-bold text-xs">{extractHourEvent(item.eventHourStart)}</p> */}
          <p className="m-0 text-blue-800 font-bold text-xs">
            {item.eventHourStart}
          </p>
          <p className="m-0 bg-blue-900 text-0">{item.cityName}</p>
        </div>
      </SwiperSlide>
    );
  };

  const responsive = {
    420: {
      slidesPerView: 1,
    },
    720: {
      slidesPerView: 2,
    },
    960: {
      slidesPerView: 3,
    },
    1150: {
      slidesPerView: 4,
    },
    1350: {
      slidesPerView: 5,
    },
    1500: {
      slidesPerView: 6,
    },
  };

  return (
    <div className="carouselCustomTopSection">
      {eventsList.length > 0 && (
        <Swiper
          spaceBetween={0}
          slidesPerView={6}
          className="w-50"
          autoplay={{ delay: 4000, disableOnInteraction: false }} // Configuración de auto-play
          loop={true}
          /* pagination={{
            clickable: true,
          }} */
          navigation
          breakpoints={responsive}
        >
          {eventsList.map((el, i) => productTemplate(el, i))}
        </Swiper>
      )}
    </div>
  );
});

export default AppTopSection;
