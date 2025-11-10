import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StreamList from "./StreamList.jsx";
import Movies from "./Movies.jsx";
import Cart from "./Cart.jsx";
import About from "./About.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation bar */}
        <nav>
          <Link to="/">StreamList</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Header box */}
        <div className="header-box">
          <h1>Welcome to StreamList!</h1>
          <p>Your very own personalized streaming list!</p>
        </div>

        {/* Page routing */}
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;