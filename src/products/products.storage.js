const { read, write } = require("../utils/fileDb");

exports.getAll = () => read("products.json");

exports.getById = (id) => read("products.json").find((p) => p.id === id);

exports.updateById = (id, updates) => {
  const products = read("products.json");
  const index = products.findIndex((p) => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  products[index] = { ...products[index], ...updates };
  write("products.json", products);
  return products[index];
};
