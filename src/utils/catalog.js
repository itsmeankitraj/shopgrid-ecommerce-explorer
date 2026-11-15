// Keep catalogue rules separate from the visual components so they are easy to test.
export function filterAndSortProducts({ products, search, filters, sortBy }) {
  const searchTerm = search.trim().toLowerCase();

  const matchingProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      filters.category === "All products" || product.category === filters.category;
    const matchesPrice = product.price <= filters.maxPrice;
    const matchesRating = product.rating >= filters.minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sortedProducts = [...matchingProducts];

  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      sortedProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      sortedProducts.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      );
  }

  return sortedProducts;
}

export function getPageItems(items, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}
