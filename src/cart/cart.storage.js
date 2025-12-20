const fileDb = require("../utils/fileDb");
const FILE = "carts.json";

exports.getAll = () => fileDb.read(FILE) || [];

exports.getByUserId = (userId) => {
  const carts = exports.getAll();
  return carts.find((c) => c.userId === userId) || { userId, items: [] };
};

exports.save = (cart) => {
  const carts = exports.getAll();
  const index = carts.findIndex((c) => c.userId === cart.userId);

  if (index === -1) {
    carts.push(cart);
  } else {
    carts[index] = cart;
  }

  fileDb.write(FILE, carts);
  return cart;
};
