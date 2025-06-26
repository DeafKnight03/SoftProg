// src/pages/NewEventPage.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './NewEventPage.css'

export default function NewEventPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { coords, address } = state || {}
  const [form, setForm] = useState({
    idEvento: '', tipoEvento: 'incidente', gravita: 'bassa',
    descrizione: '', luogo: '', data: '', ora: ''
  })

  // Popola idEvento (timestamp), luogo, data e ora al mount
  useEffect(() => {
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    setForm(f => ({
      ...f,
      idEvento: Date.now().toString(),
      luogo: `${address.road} ${address.house_number}, ${address.city}`,
      data: `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`,
      ora: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    }))
  }, [address])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // Salvare l'evento qui (API, contesto, localStorage…)
    console.log('Evento salvato:', form, coords)
    navigate('/detail', { state: { event: form, coords } })
  }

  return (
    <div className="new-event-page">
      <h2>Nuovo Evento</h2>
      <form onSubmit={handleSubmit}>
        <label>ID Evento<input name="idEvento" value={form.idEvento} readOnly/></label>
        <label>Tipo Evento
          <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange}>
            <option value="incidente">Incidente</option>
            <option value="traffico">Traffico</option>
            <option value="alluvione">Alluvione</option>
            <option value="altro">Altro</option>
          </select>
        </label>
        <label>Gravità
          <select name="gravita" value={form.gravita} onChange={handleChange}>
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label>Descrizione
          <textarea name="descrizione" rows="4" value={form.descrizione} onChange={handleChange}/>
        </label>
        <label>Luogo<input name="luogo" value={form.luogo} readOnly/></label>
        <label>Data<input type="date" name="data" value={form.data} readOnly/></label>
        <label>Ora<input type="time" name="ora" value={form.ora} readOnly/></label>
        <button type="submit">Salva Evento</button>
      </form>
    </div>
  )
}
