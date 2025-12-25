const storage = require("./products.storage");
const AppError = require("../errors/AppError");

exports.getAll = ({ gender, size, categoryId, brandId, color }) => {
  let products = storage.getAll();

  if (gender) {
    products = products.filter((p) => p.gender === gender);
  }

  if (size) {
    products = products.filter((p) => p.sizes.includes(size));
  }

  if (categoryId) {
    const catId = +categoryId;
    products = products.filter((p) => p.categoryId === catId);
  }

  if (brandId) {
    const bId = +brandId;
    products = products.filter((p) => p.brandId === bId);
  }

  if (color) {
    products = products.filter((p) => p.colors.includes(color));
  }

  return products;
};

exports.getById = (id) => {
  const product = storage.getById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

exports.updateImage = (id, imagePath) => {
  const product = storage.getById(id);
  if (!product) throw new AppError("Product not found", 404);
  
  return storage.updateById(id, { image: imagePath });
};