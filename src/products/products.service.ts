import { storage } from "./products.storage";
import { AppError } from "../errors/AppError";

const getAll = ({ gender, size, category, brandId, color }) => {
  let products = storage.getAll();

  if (gender) {
    products = products.filter((p) => p.gender === gender);
  }

  if (size) {
    products = products.filter((p) => p.sizes.includes(size));
  }

  if (category) {
    const catId = +category;
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

const getById = (id) => {
  const product = storage.getById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const service = {
  getById,
  getAll,
};
