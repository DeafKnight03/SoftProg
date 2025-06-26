// src/pages/DetailPage.jsx
import React from "react";

export default function DetailPage({ lastClick }) {
  if (!lastClick) return null;
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dettaglio Posizione</h1>
      <p>
        Hai cliccato qui:  
        <br />lat: <strong>{lastClick.lat.toFixed(5)}</strong>  
        <br />lng: <strong>{lastClick.lng.toFixed(5)}</strong>
      </p>
      {/* Qui puoi aggiungere ulteriori form o info */}
    </div>
  );
}
