import { useEffect } from "react";
import Icon from "./Icon.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function CartDrawer({ items, onClose, onQuantityChange, onRemove }) {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const delivery = items.length === 0 || subtotal >= 1999 ? 0 : 99;
  const total = subtotal + delivery;

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="overlay drawer-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-header">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h2 id="cart-title">Shopping bag <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close shopping bag"><Icon name="close" /></button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-cart-icon"><Icon name="bag" size={28} /></span>
            <h3>Your bag is taking a little break.</h3>
            <p>When something catches your eye, it will show up here.</p>
            <button className="primary-button" type="button" onClick={onClose}>Explore products <Icon name="arrow" size={16} /></button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <img src={product.image} alt="" />
                  <div className="cart-item-copy">
                    <span className="eyebrow">{product.brand}</span>
                    <h3>{product.name}</h3>
                    <strong>{formatPrice(product.price)}</strong>
                    <div className="cart-item-actions">
                      <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                        <button type="button" onClick={() => onQuantityChange(product.id, quantity - 1)} aria-label="Decrease quantity"><Icon name="minus" size={14} /></button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => onQuantityChange(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label="Increase quantity"><Icon name="plus" size={14} /></button>
                      </div>
                      <button className="remove-button" type="button" onClick={() => onRemove(product.id)}><Icon name="trash" size={14} /> Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div className="delivery-message">
                <span className="delivery-progress"><span style={{ width: `${Math.min((subtotal / 1999) * 100, 100)}%` }} /></span>
                {subtotal >= 1999 ? "You've unlocked free delivery" : `Add ${formatPrice(1999 - subtotal)} more for free delivery`}
              </div>
              <div className="summary-line"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="summary-line"><span>Delivery</span><strong>{delivery === 0 ? "Free" : formatPrice(delivery)}</strong></div>
              <div className="summary-line total-line"><span>Total</span><strong>{formatPrice(total)}</strong></div>
              <p className="demo-note">Demo project · No payment will be collected.</p>
              <button className="secondary-button full-width" type="button" onClick={onClose}>Continue exploring <Icon name="arrow" size={16} /></button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
