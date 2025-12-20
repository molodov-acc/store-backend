const storage = require("./cart.storage");
const AppError = require("../errors/AppError");

exports.getCart = (userId) => {
  return storage.getByUserId(userId);
};

exports.addToCart = ({ userId, product }) => {
  if (!product || !product.id) {
    throw new AppError("Product is required", 400);
  }

  const cart = storage.getByUserId(userId);
  // проверяем, есть ли уже товар
  const existing = cart.items.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.items.push({ ...product, quantity: product.quantity || 1 });
  }

  return storage.save(cart);
};

exports.removeFromCart = ({ userId, productId }) => {
  const cart = storage.getByUserId(userId);
  cart.items = cart.items.filter((i) => i.id !== productId);
  return storage.save(cart);
};

exports.clearCart = (userId) => {
  const cart = { userId, items: [] };
  return storage.save(cart);
};
