import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductFilters from "./components/ProductFilters.jsx";
import ProductModal from "./components/ProductModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import StudySection from "./components/StudySection.jsx";
import Icon from "./components/Icon.jsx";
import { products } from "./data/products.js";
import { filterAndSortProducts, getPageItems } from "./utils/catalog.js";
import { addCartItem, normalizeCartItems, removeCartItem, updateCartItemQuantity } from "./utils/cart.js";
import { useLocalStorage } from "./hooks.js";

const PAGE_SIZE = 8;
const DEFAULT_FILTERS = {
  category: "All products",
  maxPrice: 15000,
  minRating: 0,
};

export default function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [savedCart, setCart] = useLocalStorage("shopgrid-cart-v1", []);
  // Ignore malformed localStorage entries instead of letting them break the page.
  const cart = normalizeCartItems(savedCart, products);

  // Search and filters are combined before sorting and pagination.
  const filteredProducts = useMemo(
    () => filterAndSortProducts({ products, search, filters, sortBy }),
    [search, filters, sortBy],
  );
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = getPageItems(filteredProducts, currentPage, PAGE_SIZE);

  const cartItems = useMemo(
    () =>
      cart
        .map((cartItem) => ({
          product: products.find((product) => product.id === cartItem.productId),
          quantity: cartItem.quantity,
        }))
        .filter((item) => item.product && item.quantity > 0),
    [cart],
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, sortBy]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function updateFilter(filterName, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [filterName]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setSortBy("featured");
  }

  function addToCart(product) {
    if (product.stock < 1) return;

    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem && existingItem.quantity >= product.stock) {
      setToast("You've reached the available stock for this item");
      return;
    }

    setCart((currentCart) => addCartItem(currentCart, product, products).items);
    setToast(`${product.name} added to your bag`);
  }

  function changeQuantity(productId, nextQuantity) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    if (nextQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) => updateCartItemQuantity(currentCart, productId, nextQuantity, products));
  }

  function removeFromCart(productId) {
    setCart((currentCart) => removeCartItem(currentCart, productId, products));
  }

  return (
    <div className="app-shell" id="top">
      <Header
        search={search}
        onSearchChange={setSearch}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
      />

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <span className="hero-kicker"><span /> THE EVERYDAY EDIT · VOL. 01</span>
            <h1>Find your next<br /><em>favourite.</em></h1>
            <p>A considered collection of useful things, good design and little everyday upgrades.</p>
            <a className="hero-button" href="#products">Explore the collection <Icon name="arrow" size={17} /></a>
            <div className="hero-footnote"><Icon name="spark" size={15} /> Thoughtfully picked. Easy to love.</div>
          </div>
          <div className="hero-art" aria-label="Featured audio and lifestyle products">
            <div className="hero-glow" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <img
              className="hero-product-image"
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90"
              alt="Premium over-ear headphones"
            />
            <div className="hero-product-label">
              <span>FEATURED OBJECT</span>
              <strong>Auraluxe headphones</strong>
              <small>Sound, with a softer edge.</small>
            </div>
            <div className="hero-stamp"><span>CURATED</span><strong>01</strong><span>SHOPGRID</span></div>
          </div>
          <div className="hero-index"><span>01</span><span className="hero-index-line" /><span>03</span></div>
        </section>

        <section className="trust-strip shell" aria-label="ShopGrid highlights">
          <div><Icon name="check" size={16} /><span>Curated essentials</span></div>
          <div><Icon name="spark" size={16} /><span>Design-led finds</span></div>
          <div><Icon name="bag" size={16} /><span>A smoother way to explore</span></div>
          <span className="trust-strip-note">MADE FOR EVERYDAY DISCOVERY</span>
        </section>

        <section className="catalog-section shell" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE SHOPGRID EDIT</span>
              <h2>Explore the collection<span>.</span></h2>
              <p>Good design meets everyday usefulness.</p>
            </div>
            <span className="collection-count">{String(products.length).padStart(2, "0")} OBJECTS TO DISCOVER</span>
          </div>

          <div className="catalog-layout">
            <ProductFilters
              filters={filters}
              onChange={updateFilter}
              onClear={clearFilters}
              resultCount={filteredProducts.length}
            />

            <div className="catalog-main">
              <div className="catalog-toolbar">
                <p><strong>{filteredProducts.length}</strong> products <span>·</span> Find something good.</p>
                <label className="sort-control">
                  <span>Sort by</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="rating">Top rated</option>
                  </select>
                </label>
              </div>

              {visibleProducts.length > 0 ? (
                <>
                  <div className="product-grid">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpen={setSelectedProduct}
                        onAdd={addToCart}
                      />
                    ))}
                  </div>

                  <div className="pagination">
                    <span>Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)}</strong> of {filteredProducts.length}</span>
                    <div className="page-controls">
                      <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} aria-label="Previous page"><Icon name="left" size={17} /></button>
                      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                        <button
                          className={currentPage === page ? "active" : ""}
                          type="button"
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {String(page).padStart(2, "0")}
                        </button>
                      ))}
                      <button type="button" onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} disabled={currentPage === pageCount} aria-label="Next page"><Icon name="right" size={17} /></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <span className="no-results-icon"><Icon name="search" size={27} /></span>
                  <h3>No matches just yet.</h3>
                  <p>Try a different search or loosen a filter to see more of the collection.</p>
                  <button className="secondary-button" type="button" onClick={clearFilters}>Clear search & filters</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <StudySection />

        <section className="closing-note shell" id="about">
          <div className="closing-mark">S<span>.</span></div>
          <div>
            <span className="eyebrow">A LITTLE ABOUT SHOPGRID</span>
            <h2>Less scrolling.<br /><em>More finding.</em></h2>
          </div>
          <p>ShopGrid brings thoughtful product discovery and a practical Study Desk together — a place to find useful things, shape project ideas and keep learning.</p>
        </section>
      </main>

      <footer className="site-footer shell">
        <a className="brand" href="#top"><span className="brand-mark">S<span>.</span></span><span className="brand-name">shopgrid</span></a>
        <span>© {new Date().getFullYear()} ShopGrid. A portfolio project.</span>
        <a href="#top">Back to top ↑</a>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={(product) => {
            addToCart(product);
            setSelectedProduct(null);
          }}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onQuantityChange={changeQuantity}
          onRemove={removeFromCart}
        />
      )}

      {toast && <div className="toast" role="status"><Icon name="check" size={17} /> {toast}</div>}
    </div>
  );
}
