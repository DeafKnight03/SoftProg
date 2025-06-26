import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './NewEventPage.css'

export default function NewEventPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { coords, address } = state || {}
  const [form, setForm] = useState({
    idEvento: '',
    tipoEvento: 'incidente',
    gravita: 'bassa',
    descrizione: '',
    luogo: '',
    data: '',
    ora: '',
  })

  useEffect(() => {
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    setForm(f => ({
      ...f,
      idEvento: Date.now().toString(),
      luogo: `${address.road} ${address.house_number}, ${address.city}`,
      data: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,
      ora: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    }))
  }, [address])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Evento salvato:', form, coords)
    navigate('/detail', { state: { event: form, coords } })
  }

  return (
    <div className="new-event-page">
      <div className="form-card">
        <h2>Nuovo Evento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field-group">
              <label>ID Evento</label>
              <input name="idEvento" value={form.idEvento} readOnly />
            </div>

            <div className="field-group">
              <label>Tipo Evento</label>
              <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange}>
                <option value="incidente">Incidente</option>
                <option value="traffico">Traffico</option>
                <option value="alluvione">Alluvione</option>
                <option value="altro">Altro</option>
              </select>
            </div>

            <div className="field-group">
              <label>Gravità</label>
              <select name="gravita" value={form.gravita} onChange={handleChange}>
                <option value="bassa">Bassa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="field-group full-width">
              <label>Descrizione</label>
              <textarea
                name="descrizione"
                rows="3"
                value={form.descrizione}
                onChange={handleChange}
              />
            </div>

            <div className="field-group full-width">
              <label>Luogo</label>
              <input name="luogo" value={form.luogo} readOnly />
            </div>

            <div className="field-group">
              <label>Data</label>
              <input type="date" name="data" value={form.data} readOnly />
            </div>
            <div className="field-group">
              <label>Ora</label>
              <input type="time" name="ora" value={form.ora} readOnly />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Salva Evento
          </button>
        </form>
      </div>
    </div>
  )
}
