// src/pages/MapPage.jsx
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerData from "../data/markers-geocoded.json";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "./MapPage.css";

const ICONS = { incidente: "⚠️", traffico: "🚗", alluvione: "🌊", generico: "📍" };
const createIcon = (type) =>
  new L.DivIcon({
    className: "custom-icon",
    html: ICONS[type] || ICONS.generico,
    iconSize: [70, 70],
    iconAnchor: [55, 70],
  });

// handler interno che cattura il click e passa le coordinate
function ClickHandler({ onClick }) {
  useMapEvent("click", (e) => {
    onClick(e.latlng);
  });
  return null;
}

export default function MapPage({ onNavigate, onMapClick }) {
  const [markers, setMarkers] = useState([]);
  // nuovo state per la posizione su cui aprire il popup
  const [popupPos, setPopupPos] = useState(null);

  useEffect(() => {
    setMarkers(markerData);
  }, []);

  return (
    <div className="map-page">
      <MapContainer
        center={[44.4949, 11.3426]}
        zoom={15}
        minZoom={14}
        maxZoom={18}
        maxBounds={[[44.47, 11.30], [44.52, 11.39]]}
        maxBoundsViscosity={1}
        style={{ height: "60vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* catturo il click e apro il popup */}
        <ClickHandler
          onClick={(latlng) => {
            setPopupPos(latlng);
          }}
        />

        {/* marker statici */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.coord.lat, m.coord.lng]}
            icon={createIcon(m.type)}
          >
            <Popup>
              <strong>Tipo:</strong> {m.type}<br />
              <strong>Gravità:</strong> {m.gravita}<br />
              <strong>Indirizzo:</strong> {m.indirizzo}<br />
              <strong>Descrizione:</strong> {m.descrizione}<br />
              <strong>Data:</strong> {m.data}<br />
              <strong>Ora:</strong> {m.ora}
              <br/>
              <button
                className="navigate-button"
                onClick={() => {
                  onMapClick(popupPos);    // memorizza coordinate
                  onNavigate("detail");    // naviga a DetailPage.jsx
                }}
              >Segnala una rimozione
              </button>
            </Popup>
          </Marker>
        ))}

        {/* marker “dinamico” con popup e pulsante */}
        {popupPos && (
          <Marker position={[popupPos.lat, popupPos.lng]}>
            <Popup
              onClose={() => {
                setPopupPos(null);
              }}
            >
              <button
                className="navigate-button"
                onClick={() => {
                  onMapClick(popupPos);    // memorizza coordinate
                  onNavigate("detail");    // naviga a DetailPage.jsx
                }}
              >
                Segnala un evento qui
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
