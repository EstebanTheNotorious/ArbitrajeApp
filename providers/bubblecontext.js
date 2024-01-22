import React, { useState, useEffect, useRef } from "react";
export const BubbleContext = React.createContext();

export const BubbleProvider = ({ children }) => {
  const [showBubbleProfile, setShowBubbleProfile] = useState(false); // Estado de la sesión
  const value = {
    showBubbleProfile,
    setShowBubbleProfile,
  };
  return (
      <BubbleContext.Provider value={value}>{children}</BubbleContext.Provider>
  );
};
