import { useEffect, useState } from "react";
import Icon from "./Icon.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function ProductModal({ product, onClose, onAdd }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setImageFailed(false);
  }, [product.id]);

  return (
    <div className="overlay modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-product-title">
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close product details">
          <Icon name="close" />
        </button>
        <div className="modal-image-wrap">
          {!imageFailed ? (
            <img src={product.image} alt={product.name} onError={() => setImageFailed(true)} />
          ) : (
            <div className="modal-image-fallback"><Icon name="spark" size={48} /></div>
          )}
          <span className="product-badge">{product.badge}</span>
        </div>
        <div className="modal-copy">
          <span className="eyebrow">{product.category} / {product.brand}</span>
          <h2 id="modal-product-title">{product.name}</h2>
          <div className="modal-rating"><span>★</span> {product.rating.toFixed(1)} <span>({product.reviewCount} reviews)</span></div>
          <p className="modal-description">{product.description}</p>
          <div className="modal-details">
            {product.details.map((detail) => (
              <div key={detail}><Icon name="check" size={15} /> {detail}</div>
            ))}
          </div>
          <div className="modal-stock">{product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}</div>
          <div className="modal-buy-row">
            <div className="modal-price">
              <strong>{formatPrice(product.price)}</strong>
              <del>{formatPrice(product.compareAtPrice)}</del>
            </div>
            <button className="primary-button" type="button" onClick={() => onAdd(product)} disabled={product.stock === 0}>
              Add to bag <Icon name="arrow" size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
