const service = require("./products.service");

exports.getAll = (req, res) => {
  const products = service.getAll(req.query);
  res.json(products);
};

exports.getById = (req, res) => {
  const product = service.getById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
};
