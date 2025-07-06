// 📦 Get the current cart from localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// 💾 Save the updated cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ➕ Add a product to the cart
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();

  const index = cart.findIndex(
    (item) => item.product._id === product._id
  );

  if (index >= 0) {
    // If product already in cart, increment quantity
    cart[index].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({ product, quantity });
  }

  saveCart(cart);
};

// 🔄 Update quantity of a product
export const updateQuantity = (productId, quantity) => {
  const cart = getCart();

  const updatedCart = cart.map((item) =>
    item.product._id === productId ? { ...item, quantity } : item
  );

  saveCart(updatedCart);
};

// ❌ Remove a product from cart
export const removeFromCart = (productId) => {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item.product._id !== productId
  );

  saveCart(updatedCart);
};

// 🧹 Clear all items from the cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};
