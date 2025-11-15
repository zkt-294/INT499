import React from "react";

export default function Cart({ cartItems, setCartItems }) {
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.amount || 1),
    0
  );

  // Remove item
  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
  };

  // Update quantity
  const updateQuantity = (index, newAmount) => {
    if (newAmount < 1) return;

    const updated = cartItems.map((item, i) =>
      i === index ? { ...item, amount: newAmount } : item
    );
    setCartItems(updated);
  };

  return (
    <div className="movies-page">
      <h2>Your Cart</h2>
      <h3>Total: ${totalPrice.toFixed(2)}</h3>

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

                {/* Quantity selector */}
                <div style={{ margin: "10px 0" }}>
                  Quantity:{" "}
                  <input
                    type="number"
                    min="1"
                    value={item.amount}
                    onChange={(e) =>
                      updateQuantity(index, parseInt(e.target.value) || 1)
                    }
                    style={{ width: "50px" }}
                    disabled={item.id >= 1 && item.id <= 4} // disable for subscriptions
                  />
                </div>

                <button onClick={() => removeFromCart(index)}>Remove</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}