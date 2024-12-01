// AutoOpenPopup.js
import { Popup, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

export default function AutoOpenPopup({ children }) {
  const popupRef = useRef();
  const map = useMap();

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.openOn(map);
    }
  }, [map]);

  return (
    <Popup ref={popupRef}>
      {children}
    </Popup>
  );
}
