import { useState } from "react";
import Icon from "./Icon.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function ProductCard({ product, onOpen, onAdd }) {
  const [imageFailed, setImageFailed] = useState(false);
  const discount = Math.round((1 - product.price / product.compareAtPrice) * 100);

  return (
    <article className="product-card">
      <button className="product-visual" type="button" onClick={() => onOpen(product)} aria-label={`View ${product.name} details`}>
        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="image-fallback"><Icon name="spark" size={34} /></span>
        )}
        <span className="product-badge">{product.badge}</span>
        <span className="visual-arrow"><Icon name="arrow" size={17} /></span>
      </button>

      <div className="product-info">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span className="rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)}</span>
        </div>
        <button className="product-title" type="button" onClick={() => onOpen(product)}>
          {product.name}
        </button>
        <div className="product-bottom">
          <div className="price-stack">
            <strong>{formatPrice(product.price)}</strong>
            <del>{formatPrice(product.compareAtPrice)}</del>
            <span className="discount">{discount}% off</span>
          </div>
          <button
            className="quick-add"
            type="button"
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to bag`}
          >
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
