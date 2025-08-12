// cart.js
let cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
};

function initCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    if (typeof renderCart === "function") renderCart();
  }
  updateCartCount();
}

function addToCart(product) {
  const existingItem = cart.items.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }

  calculateTotals();
  alert(`${product.name} added to cart!`);
}

function calculateTotals() {
  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  cart.tax = cart.subtotal * 0.08;
  cart.total = cart.subtotal + cart.tax;
  localStorage.setItem("cart", JSON.stringify(cart));

  if (typeof renderCart === "function") renderCart();
  updateCartCount();
}

function updateCartCount() {
  const count = cart.items.reduce((total, item) => total + item.quantity, 0);
  const countElements = document.querySelectorAll(".cart-count");
  countElements.forEach((el) => (el.textContent = count));
}

// Initialize cart when script loads
initCart();
