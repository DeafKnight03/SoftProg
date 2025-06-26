import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
function App() {
  return (
    <div className="app-container">
      <Navbar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/map" element={<MapPage/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}
export default App;
