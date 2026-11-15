import Icon from "./Icon.jsx";
import { categories } from "../data/products.js";
import { formatPrice } from "../utils/formatPrice.js";

export default function ProductFilters({ filters, onChange, onClear, resultCount }) {
  return (
    <aside className="filter-panel" aria-label="Product filters">
      <div className="filter-heading">
        <div>
          <span className="eyebrow">REFINE YOUR SEARCH</span>
          <h2>Filters <span>{resultCount}</span></h2>
        </div>
        <button className="text-button" type="button" onClick={onClear}>Reset</button>
      </div>

      <section className="filter-section">
        <h3>Category</h3>
        <div className="category-options">
          {categories.map((category) => (
            <button
              className={`category-option ${filters.category === category ? "selected" : ""}`}
              type="button"
              key={category}
              onClick={() => onChange("category", category)}
              aria-pressed={filters.category === category}
            >
              <span>{category}</span>
              {filters.category === category && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section price-filter">
        <div className="filter-label-row">
          <h3>Maximum price</h3>
          <strong>{formatPrice(filters.maxPrice)}</strong>
        </div>
        <input
          className="price-range"
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={filters.maxPrice}
          onChange={(event) => onChange("maxPrice", Number(event.target.value))}
          aria-label="Maximum price"
        />
        <div className="range-labels"><span>₹1,000</span><span>₹15,000</span></div>
      </section>

      <section className="filter-section">
        <h3>Customer rating</h3>
        <div className="rating-options">
          {[0, 4, 4.5].map((rating) => (
            <button
              className={`rating-option ${filters.minRating === rating ? "selected" : ""}`}
              type="button"
              key={rating}
              onClick={() => onChange("minRating", rating)}
              aria-pressed={filters.minRating === rating}
            >
              <span>{rating === 0 ? "All ratings" : `${rating}+`}</span>
              {rating > 0 && <span className="rating-stars">★</span>}
              {filters.minRating === rating && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      </section>

      <div className="filter-note">
        <Icon name="spark" size={17} />
        <p>Good things, thoughtfully picked. Explore at your own pace.</p>
      </div>
    </aside>
  );
}
