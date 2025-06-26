import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => (
  <nav className="navbar">
    <div className="nav-logo">SOScial</div>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/map">Map</Link>
    </div>
  </nav>
);
export default Navbar;
