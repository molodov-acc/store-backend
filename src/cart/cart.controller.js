const service = require("./cart.service");

exports.getCart = (req, res) => {
  const cart = service.getCart(req.user.id);
  res.json(cart);
};

exports.addToCart = (req, res) => {
  const cart = service.addToCart({ userId: req.user.id, product: req.body });
  res.json(cart);
};

exports.removeFromCart = (req, res) => {
  const cart = service.removeFromCart({
    userId: req.user.id,
    productId: req.params.productId,
  });
  res.json(cart);
};

exports.clearCart = (req, res) => {
  const cart = service.clearCart(req.user.id);
  res.json(cart);
};
