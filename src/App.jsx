// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import NewEventPage from './pages/NewEventPage'
import DetailPage from './pages/DetailPage'
import ListaSegnalazioni from './pages/ListaSegnalazioni'
import SegnalazioneDetailPage from './pages/SegnalazioneDetailPage'

export default function App() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/new-event" element={<NewEventPage />} />
          <Route path="/detail" element={<DetailPage />} />
          <Route path="/admin" element={<ListaSegnalazioni />} />                            
          <Route path="/admin/:idSignal" element={<SegnalazioneDetailPage />} />             
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
