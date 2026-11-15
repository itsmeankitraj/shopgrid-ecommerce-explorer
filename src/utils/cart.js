// Cart state stores only product ids and quantities, not full product objects.
export function normalizeCartItems(value, products) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || !Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return [];
    }

    const product = products.find((entry) => entry.id === item.productId);
    if (!product) return [];

    return [{ productId: item.productId, quantity: Math.min(item.quantity, product.stock) }];
  });
}

export function addCartItem(value, product, products) {
  const safeCart = normalizeCartItems(value, products);
  if (!product || product.stock < 1) {
    return { items: safeCart, added: false, reason: "unavailable" };
  }

  const existingItem = safeCart.find((item) => item.productId === product.id);
  if (existingItem && existingItem.quantity >= product.stock) {
    return { items: safeCart, added: false, reason: "limit" };
  }

  if (existingItem) {
    return {
      items: safeCart.map((item) =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
      added: true,
      reason: "added",
    };
  }

  return {
    items: [...safeCart, { productId: product.id, quantity: 1 }],
    added: true,
    reason: "added",
  };
}

export function updateCartItemQuantity(value, productId, nextQuantity, products) {
  const safeCart = normalizeCartItems(value, products);
  const product = products.find((entry) => entry.id === productId);
  if (!product || !Number.isFinite(nextQuantity)) return safeCart;
  if (nextQuantity < 1) return safeCart.filter((item) => item.productId !== productId);

  return safeCart.map((item) =>
    item.productId === productId
      ? { ...item, quantity: Math.min(Math.floor(nextQuantity), product.stock) }
      : item,
  );
}

export function removeCartItem(value, productId, products) {
  return normalizeCartItems(value, products).filter((item) => item.productId !== productId);
}
