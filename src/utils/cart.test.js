import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../data/products.js";
import {
  addCartItem,
  normalizeCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "./cart.js";

const headphones = products.find((product) => product.id === 1);
const watch = products.find((product) => product.id === 2);

test("cart normalisation removes invalid items and caps quantities at stock", () => {
  const result = normalizeCartItems(
    [null, { productId: 999, quantity: 1 }, { productId: 1, quantity: 999 }, { productId: 2, quantity: 0 }],
    products,
  );

  assert.deepEqual(result, [{ productId: headphones.id, quantity: headphones.stock }]);
});

test("adding a product creates a cart line and increments an existing line", () => {
  const firstAdd = addCartItem([], headphones, products);
  const secondAdd = addCartItem(firstAdd.items, headphones, products);

  assert.equal(firstAdd.added, true);
  assert.deepEqual(firstAdd.items, [{ productId: headphones.id, quantity: 1 }]);
  assert.deepEqual(secondAdd.items, [{ productId: headphones.id, quantity: 2 }]);
});

test("adding a product cannot exceed its available stock", () => {
  const fullCart = [{ productId: watch.id, quantity: watch.stock }];
  const result = addCartItem(fullCart, watch, products);

  assert.equal(result.added, false);
  assert.equal(result.reason, "limit");
  assert.deepEqual(result.items, fullCart);
});

test("quantity updates are capped and a quantity below one removes the item", () => {
  const cart = [{ productId: headphones.id, quantity: 2 }];
  const capped = updateCartItemQuantity(cart, headphones.id, 999, products);
  const removed = updateCartItemQuantity(capped, headphones.id, 0, products);

  assert.deepEqual(capped, [{ productId: headphones.id, quantity: headphones.stock }]);
  assert.deepEqual(removed, []);
});

test("removing one product keeps the other cart lines", () => {
  const cart = [
    { productId: headphones.id, quantity: 1 },
    { productId: watch.id, quantity: 2 },
  ];
  assert.deepEqual(removeCartItem(cart, headphones.id, products), [
    { productId: watch.id, quantity: 2 },
  ]);
});
