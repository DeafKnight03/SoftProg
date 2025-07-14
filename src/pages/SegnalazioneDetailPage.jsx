// src/pages/SegnalazioneDetailPage.jsx
import React, { useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import segnalazioni from '../data/segnalazioni.json'
import markerData from '../data/markers-geocoded.json'
import sampleImg1 from '../data/images.jpeg'
import sampleImg2 from '../data/incidente_stradale_1_pixabay_2017.jpg'
import sampleImg3 from '../data/incidente-10-2.jpg'
import './SegnalazioneDetailPage.css'

export default function SegnalazioneDetailPage() {
  const { idSignal } = useParams()
  const navigate = useNavigate()
  const seg = segnalazioni.find(s => String(s.idSignal) === idSignal)

  const carouselRef = useRef(null)
  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return
    const { offsetWidth } = carouselRef.current
    carouselRef.current.scrollBy({ left: direction * offsetWidth, behavior: 'smooth' })
  }

  if (!seg) {
    return <div className="not-found">Segnalazione non trovata.</div>
  }

  const { tipoSegnalazione, idEvento } = seg

  // Azioni di conferma e rifiuto
  const handleAccept = () => {
    alert('Evento aggiunto con successo')
    navigate('/admin')
  }
  const handleReject = () => {
    alert('Segnalazione rifiutata')
    navigate('/admin')
  }

  return (
    <div className={`detail-card ${tipoSegnalazione}`}>
      <h2>Dettaglio Segnalazione</h2>

      <div className="segnalazione-info">
        <div><strong>Tipo Segnalazione:</strong> {tipoSegnalazione}</div>
        <div><strong>ID Segnalazione:</strong> {seg.idSignal}</div>
        {tipoSegnalazione === 'rimozione' && (
          <div><strong>ID Evento da rimuovere:</strong> {idEvento}</div>
        )}
      </div>

      {tipoSegnalazione === 'rimozione' && (() => {
        const evento = markerData.find(m => String(m.id) === String(idEvento))
        if (!evento) {
          return <div className="not-found">Evento da rimuovere non trovato.</div>
        }
        return (
          <div className="evento-info">
            <h3>Evento da rimuovere</h3>
            <div><strong>Tipo:</strong> {evento.type || evento.tipoEvento}</div>
            <div><strong>Gravità:</strong> {evento.gravita}</div>
            <div><strong>Indirizzo:</strong> {evento.indirizzo}</div>
            <div><strong>Descrizione:</strong> {evento.descrizione}</div>
            <div><strong>Data:</strong> {evento.data}</div>
            <div><strong>Ora:</strong> {evento.ora}</div>
          </div>
        )
      })()}

      {tipoSegnalazione === 'aggiunta' && (
        <div className="aggiunta-info">
          <h3>Dettagli Aggiunta</h3>
          {Object.entries(seg)
            .filter(([key]) => !['tipoSegnalazione', 'idSignal'].includes(key))
            .map(([key, val]) => (
              <div key={key} className="field-detail">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {val}
              </div>
            ))}

          {/* Carosello posizionato in fondo alla card, centrato */}
          <div className="carousel-wrapper center">
            <button className="carousel-btn prev" onClick={() => scrollCarousel(-1)}>&lt;</button>
            <div className="carousel-container" ref={carouselRef}>
              <img src={sampleImg1} alt="Placeholder" className="carousel-image" />
              <img src={sampleImg2} alt="Placeholder" className="carousel-image" />
              <img src={sampleImg3} alt="Placeholder" className="carousel-image" />
            </div>
            <button className="carousel-btn next" onClick={() => scrollCarousel(1)}>&gt;</button>
          </div>
        </div>
      )}

      {/* Pulsanti di azione */}
      <div className="action-container">
        {tipoSegnalazione === 'aggiunta' ? (
          <>
            <button
              className="action-btn add-btn"
              onClick={handleAccept}
            >
              Aggiungi Evento
            </button>
            <button
              className="action-btn reject-btn"
              onClick={handleReject}
            >
              Rifiuta
            </button>
          </>
        ) : (
          <button
            className="action-btn remove-btn"
            onClick={() => { alert('Evento rimosso con successo'); navigate('/admin') }}
          >
            Rimuovi Evento
          </button>
        )}
      </div>

      <Link to="/admin" className="back-link">← Torna alla Lista</Link>
    </div>
  )
}
