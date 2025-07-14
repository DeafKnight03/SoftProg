import React from 'react'
import { Link } from 'react-router-dom'
import segnalazioni from '../data/segnalazioni.json'
import './ListaSegnalazioni.css'

export default function ListaSegnalazioni() {
  return (
    <div className="lista-segnalazioni-page">
      <h2>Lista Segnalazioni</h2>
      <ul className="segnalazioni-list">
        {segnalazioni.map(s => (
          <li
            key={s.idSignal}
            className={`segnalazione-item ${s.tipoSegnalazione}`}
          >
            <Link to={`/admin/${s.idSignal}`} className="segnalazione-link">
              {`${s.idSignal} – ${s.tipoSegnalazione.toUpperCase()} – ${
                s.tipoSegnalazione === 'rimozione' ? "idEvento:"+s.idEvento : s.type
              }`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
