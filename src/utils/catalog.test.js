import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../data/products.js";
import { filterAndSortProducts, getPageItems } from "./catalog.js";

const defaultFilters = {
  category: "All products",
  maxPrice: 15000,
  minRating: 0,
};

test("the demo catalogue has unique ids and usable product values", () => {
  const ids = products.map((product) => product.id);
  assert.equal(new Set(ids).size, products.length, "product ids should be unique");
  assert.ok(products.length >= 8, "catalogue should contain enough products for pagination");

  for (const product of products) {
    assert.ok(product.name.trim());
    assert.ok(product.category.trim());
    assert.ok(product.price > 0);
    assert.ok(product.stock > 0);
    assert.ok(product.rating >= 0 && product.rating <= 5);
  }
});

test("search matches a product name, brand or category without case sensitivity", () => {
  const byName = filterAndSortProducts({
    products,
    search: "auraluxe",
    filters: defaultFilters,
    sortBy: "featured",
  });
  assert.ok(byName.length >= 1);
  assert.ok(byName.every((product) => product.brand.toLowerCase().includes("auraluxe")));

  const byCategory = filterAndSortProducts({
    products,
    search: "workspace",
    filters: defaultFilters,
    sortBy: "featured",
  });
  assert.ok(byCategory.length >= 1);
  assert.ok(byCategory.every((product) => product.category === "Workspace"));
});

test("category, maximum price and minimum rating filters combine correctly", () => {
  const result = filterAndSortProducts({
    products,
    search: "",
    filters: { category: "Audio", maxPrice: 7000, minRating: 4.4 },
    sortBy: "featured",
  });

  assert.ok(result.length > 0);
  assert.ok(result.every((product) => product.category === "Audio"));
  assert.ok(result.every((product) => product.price <= 7000));
  assert.ok(result.every((product) => product.rating >= 4.4));
});

test("price sorting is ascending and descending", () => {
  const ascending = filterAndSortProducts({ products, search: "", filters: defaultFilters, sortBy: "price-low" });
  const descending = filterAndSortProducts({ products, search: "", filters: defaultFilters, sortBy: "price-high" });

  assert.ok(ascending[0].price <= ascending.at(-1).price);
  assert.ok(descending[0].price >= descending.at(-1).price);
});

test("rating sorting places the highest-rated product first", () => {
  const result = filterAndSortProducts({ products, search: "", filters: defaultFilters, sortBy: "rating" });
  assert.equal(result[0].rating, Math.max(...products.map((product) => product.rating)));
});

test("pagination returns the correct page and an empty page past the end", () => {
  const firstPage = getPageItems(products, 1, 8);
  const secondPage = getPageItems(products, 2, 8);
  const thirdPage = getPageItems(products, 3, 8);

  assert.equal(firstPage.length, 8);
  assert.equal(secondPage.length, 8);
  assert.equal(thirdPage.length, 0);
  assert.notEqual(firstPage[0].id, secondPage[0].id);
});
