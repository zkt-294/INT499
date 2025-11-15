import React from "react";

export default function Cart({ cartItems, removeFromCart }) {
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <div className="movies-page">
      <h2>Your Cart</h2>
      
      {/* Total price */}
      <div style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "1.2em" }}>
        Total: ${totalPrice.toFixed(2)}
      </div>

      <div className="results-grid">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => {
            const imageUrl =
              item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : item.img || "https://via.placeholder.com/200x300?text=No+Image";

            const title = item.title || item.name || item.service;
            const type = item.media_type || item.type || "Item";
            const extraInfo = item.serviceInfo || null;

            return (
              <div className="cart-card" key={index}>
                <img src={imageUrl} alt={title} />
                <h4>{title}</h4>
                <p>{type}</p>
                {extraInfo && <p>{extraInfo}</p>}
                {item.price && <p>${item.price.toFixed(2)}</p>}
                <button onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}