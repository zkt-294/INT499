import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import StreamList from "./StreamList.jsx";
import Movies from "./Movies.jsx";
import Cart from "./Cart.jsx";
import About from "./About.jsx";
import Subscriptions from "./Subscriptions.jsx";

import MovieIcon from "./icons/MovieIcon.jsx";
import CartIcon from "./icons/CartIcon.jsx";
import AboutIcon from "./icons/AboutIcon.jsx";
import SubscriptionIcon from "./icons/SubscriptionIcon.jsx";

import "./App.css";

function App() {
  // Load cart from localStorage on startup
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const isSubscription = item.id >= 1 && item.id <= 4;

      if (isSubscription) {
        // Only allow one subscription
        const existingSubscription = prev.find((i) => i.id >= 1 && i.id <= 4);
        if (existingSubscription) {
          alert("You can only have one subscription at a time!");
          return prev;
        }
        return [...prev, { ...item, amount: 1 }];
      } else {
        // Accessories/items can have multiple
        const existingIndex = prev.findIndex((i) => i.id === item.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            amount: updated[existingIndex].amount + 1,
          };
          return updated;
        } else {
          return [...prev, { ...item, amount: 1 }];
        }
      }
    });
  };

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav>
          <Link to="/">StreamList</Link>

          <Link to="/movies" className="nav-item">
            <MovieIcon className="nav-icon" />
            Movies
          </Link>

          <Link to="/cart" className="nav-item">
            <CartIcon className="nav-icon" />
            Cart ({cartItems.length})
          </Link>

          <Link to="/about" className="nav-item">
            <AboutIcon className="nav-icon" />
            About
          </Link>

          <Link to="/subscriptions" className="nav-item">
            <SubscriptionIcon className="nav-icon" />
            Subscriptions
          </Link>
        </nav>

        {/* Header */}
        <div className="header-box">
          <h1>Welcome to StreamList!</h1>
          <p>Your very own personalized streaming list!</p>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<StreamList />} />

          <Route
            path="/movies"
            element={<Movies onAddToCart={addToCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
          />

          <Route
            path="/subscriptions"
            element={<Subscriptions cartItems={cartItems} onAddToCart={addToCart} />}
          />

          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;