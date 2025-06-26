// src/pages/MapPage.jsx
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import markerData from '../data/markers-geocoded.json'

const ICONS = { incidente: '⚠️', traffico: '🚗', alluvione: '🌊', generico: '📍' }
const createIcon = type => new L.DivIcon({
  className: 'custom-icon',
  html: ICONS[type] || ICONS.generico,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

function ClickHandler({ onClick }) {
  useMapEvent('click', e => onClick(e.latlng))
  return null
}

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [popupPos, setPopupPos] = useState(null)
  const [address, setAddress] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setMarkers(markerData)
  }, [])

  // Quando cambia popupPos, fai reverse geocoding
  useEffect(() => {
    if (!popupPos) return
    setAddress(null)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${popupPos.lat}&lon=${popupPos.lng}`
    )
      .then(res => res.json())
      .then(data => {
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
    <MapContainer center={[44.4949, 11.3426]} zoom={15} style={{ width: '50vw',height: '50vh', margin: '0 auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '4rem' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ClickHandler onClick={setPopupPos} />

      {markers.map(m => (
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
          // qui puoi lanciare la logica di segnalazione
          console.log(`Segnala rimozione per evento ${m.id}`);
        }}
      >Segnala Rimozione</button>
    </Popup>
  </Marker>
))}


      {popupPos && (
        <Marker position={[popupPos.lat, popupPos.lng]} icon={createIcon('generico')}>
          <Popup onClose={() => setPopupPos(null)}>
            {address
              ? <>
                  <div><strong>Via:</strong> {address.road}</div>
                  <div><strong>Civico:</strong> {address.house_number}</div>
                  <div><strong>Città:</strong> {address.city}</div>
                </>
              : <em>Caricamento indirizzo…</em>
            }
            <button
              className="navigate-button"
              onClick={() => {
                navigate('/new-event', {
                  state: { coords: popupPos, address }
                })
              }}
            >
              Nuovo evento qui
            </button>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
