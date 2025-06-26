// src/pages/MapPage.jsx
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './MapPage.css'
import markerData from '../data/markers-geocoded.json'

// Mappa degli emoji da usare sia sulle icone che in legenda
const ICONS = {
  incidente: '⚠️',
  traffico: '🚗',
  alluvione: '🌊',
  generico: '📍',
}

// Crea un DivIcon con dimensioni appropriate
const createIcon = (type) =>
  new L.DivIcon({
    className: 'custom-icon',
    html: ICONS[type] || ICONS.generico,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })

// Cattura i click sulla mappa
function ClickHandler({ onClick }) {
  useMapEvent('click', (e) => onClick(e.latlng))
  return null
}

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [popupPos, setPopupPos] = useState(null)
  const [address, setAddress] = useState(null)
  const navigate = useNavigate()

  // carica i marker
  useEffect(() => {
    setMarkers(markerData)
  }, [])

  // reverse‐geocoding quando si clicca
  useEffect(() => {
    if (!popupPos) return
    setAddress(null)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${popupPos.lat}&lon=${popupPos.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        const a = data.address || {}
        setAddress({
          road: a.road || '',
          house_number: a.house_number || '',
          city: a.city || a.town || '',
        })
      })
      .catch(console.error)
  }, [popupPos])

  return (
    <div className="map-content-container">
      {/* Colonna sinistra: la mappa */}
      <div className="map-wrapper">
        <MapContainer
          center={[44.4949, 11.3426]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          minZoom={14}
          maxZoom={18}
          maxBounds={[[44.47, 11.30], [44.52, 11.39]]}
          maxBoundsViscosity={1}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <ClickHandler onClick={setPopupPos} />

          {markers.map((m) => (
            <Marker
              key={m.id}
              position={[m.coord.lat, m.coord.lng]}
              icon={createIcon(m.type)}
            >
              <Popup>
                <div><strong>Tipo:</strong> {m.type}</div>
                <div><strong>Gravità:</strong> {m.gravita}</div>
                <div><strong>Indirizzo:</strong> {m.indirizzo}</div>
                <div><strong>Descrizione:</strong> {m.descrizione}</div>
                <div><strong>Data:</strong> {m.data}</div>
                <div><strong>Ora:</strong> {m.ora}</div>
                <button
                  className="remove-report-btn"
                  onClick={() => {
                    alert('Segnalazione effettuata con successo')
                    navigate('/map')
                  }}
                >
                  Segnala rimozione
                </button>
              </Popup>
            </Marker>
          ))}

          {popupPos && (
            <Marker position={[popupPos.lat, popupPos.lng]} icon={createIcon('generico')}>
              <Popup onClose={() => setPopupPos(null)}>
                {address ? (
                  <>
                    <div><strong>Via:</strong> {address.road}</div>
                    <div><strong>Civico:</strong> {address.house_number}</div>
                    <div><strong>Città:</strong> {address.city}</div>
                  </>
                ) : (
                  <em>Caricamento indirizzo…</em>
                )}
                <button
                  className="navigate-button"
                  onClick={() => {
                    navigate('/new-event', { state: { coords: popupPos, address } })
                  }}
                >
                  Nuovo evento qui
                </button>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Colonna destra: la legenda */}
      <div className="legend">
        <h3>Legenda</h3>
        <ul>
          <li>
            <span className="legend-icon">{ICONS.incidente}</span>
            Incidente
          </li>
          <li>
            <span className="legend-icon">{ICONS.traffico}</span>
            Traffico
          </li>
          <li>
            <span className="legend-icon">{ICONS.alluvione}</span>
            Alluvione
          </li>
          <li>
            <span className="legend-icon">{ICONS.generico}</span>
            Altro
          </li>
        </ul>
        <p>
          Clicca sulla mappa per aggiungere un nuovo evento. 
          <br />
          Per rimuovere un evento, clicca sull'icona corrispondente.
        </p>
      </div>
    </div>
  )
}
