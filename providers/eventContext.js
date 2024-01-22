import React, { useState, useEffect, useRef } from "react";
export const EventContext = React.createContext();

export const EventProvider = ({ children }) => {
//   const [eventsList, setEventsList] = useState([]);
  const [chargeEvents, setChargeEvents] = useState(false);

  /* useEffect(() => {
    loadEvents();
  }, []); */

  /* const loadEvents = async () => {
    await requestValdationToken('Event/GetAllEvents').then(res => {
        if (res.data.statusCode === 200) setEventsList(res.data.result);
    })
  } */

  const value = {
    chargeEvents,
    setChargeEvents
  };
  return (
      <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
