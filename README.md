# ShopGrid — Product Explorer & Study Desk

ShopGrid is a portfolio-oriented product explorer with a built-in engineering Study Desk. It is built with React, JavaScript and CSS. The shop focuses on product discovery and cart behaviour; the Study Desk adds useful project tools, reference books and practice resources. It runs without a backend, payment service or unnecessary libraries.

## Features

- Search products by product name, brand or category
- Filter by category, maximum price and customer rating
- Sort by featured, newest, price or rating
- Paginated product grid (8 products per page)
- Product details modal with description, features and stock information
- Shopping bag with add, remove and quantity controls
- Cart persistence with `localStorage` (the bag remains after a page refresh)
- Stock-aware quantity limits and free-delivery progress indicator
- Responsive dark interface for desktop, tablet and mobile
- Keyboard shortcut: `⌘ K` on Mac or `Ctrl K` on Windows/Linux to focus search
- Study Desk with an engineering project brief planner saved in local storage
- Interactive Ohm’s law calculator (enter any two of voltage, current and resistance)
- Unit converter for length, mass and temperature
- Credit-weighted SGPA calculator with subject rows
- Searchable reading shelf linking to six official online books and eTextbooks
- Practice links for freeCodeCamp, Exercism, MDN and GitHub Skills
- Accessible labels, keyboard-dismissable dialogs and reduced-motion support

## Tech stack

- React 19.3
- Vite 8.3
- `@vitejs/plugin-react` 6
- JavaScript (ES6+)
- CSS3
- Browser `localStorage`

The app uses a local JavaScript product catalogue in `src/data/products.js`. It does not need an API key, database or server account.

## Run locally

### 1. Install Node.js

Use Node.js 20.19 or newer in the 20.x line, or Node.js 22.12 or newer. These are Vite 8 requirements.

### 2. Open the project

Extract the ZIP, open the `shopgrid` folder in VS Code, then open **Terminal → New Terminal**.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local address printed in the terminal (usually `http://localhost:5173`).

### 5. Create a production build

```bash
npm run build
```

Vite writes the production files to the `dist/` folder. Run the built-in behaviour tests with `npm test`. You can preview a production build locally with:

```bash
npm run preview
```

## Project structure

```text
shopgrid/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx       # Shopping bag and quantity controls
│   │   ├── Header.jsx           # Brand, navigation, search and cart
│   │   ├── Icon.jsx             # Small reusable inline SVG icons
│   │   ├── ProductCard.jsx      # Product tile
│   │   ├── ProductFilters.jsx   # Category, price and rating filters
│   │   ├── ProductModal.jsx     # Product details dialog
│   │   ├── StudySection.jsx     # Study tools, books and practice links
│   │   └── StudySection.css     # Study Desk styling and responsive layout
│   ├── data/
│   │   ├── products.js          # Demo product catalogue
│   │   └── studyResources.js    # Official book and practice resource links
│   ├── utils/
│   │   ├── cart.js              # Cart add, update, remove and validation logic
│   │   ├── cart.test.js         # Cart behaviour tests
│   │   ├── catalog.js           # Search, filters, sorting and pagination helpers
│   │   ├── catalog.test.js      # Product catalogue behaviour tests
│   │   ├── studyTools.js        # Engineering and academic calculations
│   │   ├── studyTools.test.js   # Study tool calculation tests
│   │   └── formatPrice.js       # INR price formatting
│   ├── App.jsx                  # Main page and product/cart state
│   ├── App.css                  # Main layout and product styles
│   ├── hooks.js                 # Small localStorage hook
│   ├── index.css                # Global reset and base styles
│   └── main.jsx                 # React entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Where to start reading the code

1. `src/main.jsx` — see how React starts the application.
2. `src/App.jsx` — follow the main page state, filtering, sorting, pagination and cart functions.
3. `src/data/products.js` — edit product names, descriptions, images, categories, prices and stock.
4. `src/components/ProductCard.jsx` — understand how one product card is displayed.
5. `src/utils/cart.js` — follow the cart rules for adding, updating and removing items.
6. `src/components/StudySection.jsx` — explore the tools, book shelf and practice resources.
7. `src/utils/studyTools.js` — understand the small, testable engineering and academic calculations.
8. `src/hooks.js` — see how the shopping cart is saved and restored through `localStorage`.

## Notes and limitations

- This is a testing project. Checkout and real payments are intentionally not included.
- Product information is demo data and does not represent real inventory.
- Product photos and Google Fonts are loaded from external URLs, so an internet connection is needed for those visual assets. The core app and its interactions run locally without a backend.
- The cart and saved project briefs are stored in the current browser's local storage. Clearing browser site data will clear them.
- Study books and practice platforms are linked to their official external websites; ShopGrid does not host book files or course content.
- SGPA uses the common credit-weighted formula. Check your university's own regulations for official result calculations.
  
A responsive React product explorer with search, filters, sorting, pagination, a localStorage-powered cart and an engineering Study Desk with project tools, books and practice links.
