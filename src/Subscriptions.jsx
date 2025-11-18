import React, { useState } from "react";
import list from "./data";

export default function Subscription({ onAddToCart, cartItems }) {
  const [warning, setWarning] = useState("");

  const handleAdd = (item) => {
    const isSubscription = item.id <= 4; // first 4 items are subscriptions
    const hasSubscription = cartItems.some((i) => i.id <= 4);

    if (isSubscription && hasSubscription) {
      setWarning("You can only have one subscription at a time!");
      setTimeout(() => setWarning(""), 3000);
      return;
    }

    onAddToCart(item);
  };

  return (
    <div className="movies-page">
      <h2>Subscriptions & Accessories</h2>

      {warning && <p style={{ color: "red" }}>{warning}</p>}

      <div className="results-grid">
        {list.map((item) => (
          <div key={item.id} className="result-card">
            <img src={item.img} alt={item.service} />
            <h4>{item.service}</h4>
            <p>{item.serviceInfo}</p>
            <p><strong>${item.price.toFixed(2)}</strong></p>
            <button onClick={() => handleAdd(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}