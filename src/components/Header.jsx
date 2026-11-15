import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

export default function Header({ search, onSearchChange, cartCount, onCartOpen }) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    function focusSearch(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <a className="brand" href="#top" aria-label="ShopGrid home">
          <span className="brand-mark">S<span>.</span></span>
          <span className="brand-name">shopgrid</span>
        </a>

        <label className="header-search">
          <Icon name="search" size={17} />
          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products, brands..."
            aria-label="Search products and brands"
          />
          <kbd>⌘ K</kbd>
        </label>

        <nav className="header-links" aria-label="Main navigation">
          <a href="#products">Discover</a>
          <a href="#study">Study desk</a>
          <a href="#about">Our story</a>
        </nav>

        <button className="cart-trigger" type="button" onClick={onCartOpen} aria-label={`Open cart with ${cartCount} items`}>
          <Icon name="bag" size={19} />
          <span className="cart-trigger-label">Bag</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
