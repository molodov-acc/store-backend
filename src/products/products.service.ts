import { storage } from "./products.storage";
import { AppError } from "../errors/AppError";
import { ProductQuery } from "./types";
import { Product } from "../shared/types/types";

const getAll = async ({
  gender,
  size,
  categoryId,
  brandId,
  color,
}: ProductQuery) => {
  let products = (await storage.getAll()) as Product[];

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

const getById = async (id: string) => {
  const product = await storage.getById(id);

  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const service = {
  getById,
  getAll,
};
