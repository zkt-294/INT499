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

  // Helper to check if item is a subscription
  const isSubscription = (item) => item.id >= 1 && item.id <= 4;

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
      <h2 id="cart-heading">Your Cart</h2>
      <h3>Total: ${Number.isFinite(totalPrice) ? totalPrice.toFixed(2) : "0.00"}</h3>

      <div className="results-grid">
        {cartItems.length === 0 ? (
          <p role="status" aria-live="polite">Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => {
            const imageUrl =
              item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : item.img || "https://via.placeholder.com/200x300?text=No+Image";

            const title = item.title || item.name || item.service || "No title available";
            const type = item.media_type || item.type || "Item";
            const extraInfo = item.serviceInfo || null;
            const amount = typeof item.amount === "number" && item.amount > 0 ? item.amount : 1;
            const price = typeof item.price === "number" ? item.price : 0;

            return (
              <div className="cart-card" key={item.id || index}>
                <img src={imageUrl} alt={title} aria-label={title} />
                <h4>{title}</h4>
                <p>{type}</p>
                {extraInfo && <p>{extraInfo}</p>}
                {price > 0 && <p>${price.toFixed(2)}</p>}

                {/* Quantity selector */}
                <div style={{ margin: "10px 0" }}>
                  <label htmlFor={`quantity-${item.id || index}`}>Quantity:</label>{" "}
                  <input
                    id={`quantity-${item.id || index}`}
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) =>
                      updateQuantity(index, parseInt(e.target.value) || 1)
                    }
                    style={{ width: "50px" }}
                    disabled={isSubscription(item)}
                    aria-label={isSubscription(item) ? "Quantity not editable for subscriptions" : `Set quantity for ${title}`}
                  />
                  {isSubscription(item) && (
                    <span style={{ marginLeft: "8px" }} aria-live="polite">(Subscriptions are limited to 1)</span>
                  )}
                </div>

                <button onClick={() => removeFromCart(index)} aria-label={`Remove ${title} from cart`}>
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}