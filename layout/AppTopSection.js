// import Link from "next/link";
// import { useRouter } from "next/router";
// import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useState,
  useEffect
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
// import { TopSectionService } from "../mockups/services/TopSectionService";
import { requestValdationToken } from "../utils/axios/axios";
import moment from "moment";
import { EventContext } from "../providers/eventContext";
import { Tooltip } from 'primereact/tooltip';

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
      cityName: 'Quito',
    },
    {
      eventName: "Evento 1",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: 'Quito',
    },
    {
      eventName: "Evento 1",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: 'Quito',
    },
    {
      eventName: "Evento 1",
      eventStartDate: "12-12-24",
      eventHourStart: "15:00",
      cityName: 'Quito',
    }
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
        // setMsgErrorLogin(err.response.data)
      });
  }
  const responsiveOptions = [
    {
      breakpoint: "1865px",
      numVisible: 9,
      numScroll: 1,
    },
    {
      breakpoint: "1440px",
      numVisible: 9,
      numScroll: 1,
    },
    {
      breakpoint: "1290px",
      numVisible: 7,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: "1020px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "891px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const extractHourEvent = (value) => {
    const partes = value.split(':');
    // Obtener las horas y minutos
    const horas = partes[0];
    const minutos = partes[1];
    return horas + ':' + minutos;
  }


  const productTemplate = (item) => {
    return (
      <div className="top-section-card d-inline-block justify-content-center align-items-center border-1 border-dashed surface-border pt-1 text-center w-100"
        style={{ height: '88px', verticalAlign: 'middle', cursor: 'pointer' }}>
        {item.eventName.length > 10 && <Tooltip target=".event-name" />}
        <p
          className="event-name m-0 text-red-600 font-bold text-xs"
          style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
          data-pr-tooltip={item.eventName}
          data-pr-position="bottom"
        >{item.eventName}</p>
        {/* <p className="m-0 text-blue-800 font-bold text-xs">{moment(item.eventStartDate).format('DD-MM-YY')}</p> */}
        <p className="m-0 text-blue-800 font-bold text-xs">{item.eventStartDate}</p>
        {/* <p className="m-0 font-bold text-xs">{moment(item.eventEndDate).format('DD-MM-YY')}</p> */}
        {/* <p className="m-0 text-blue-800 font-bold text-xs">{extractHourEvent(item.eventHourStart)}</p> */}
        <p className="m-0 text-blue-800 font-bold text-xs">{item.eventHourStart}</p>
        <p className="m-0 bg-blue-900 text-0">{item.cityName}</p>
      </div>
    );
  };

  return (
    <>
      {
        eventsList?.length > 0 &&
        <div className="layout-topsection">
          <div className="container-topsection">
            <Carousel
              value={eventsList}
              numVisible={5}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              /* circular
              autoplayInterval={5000} */
              itemTemplate={productTemplate}
              showIndicators={false}
              className="custom-carousel"
            />
          </div>
        </div>
      }
    </>
  );
});

export default AppTopSection;
