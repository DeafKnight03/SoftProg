// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import NewEventPage from './pages/NewEventPage'
import DetailPage from './pages/DetailPage'

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
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
