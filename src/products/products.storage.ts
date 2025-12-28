import { Product } from "../shared/types/types";
import { fileDb } from "../shared/utils/fileDb";

const getAll = async () => await fileDb.read("products.json");

const getById = async (productId: string) => {
  const products = (await fileDb.read("products.json")) as Product[];
  return products.find(({ id }) => id === productId);
};

export const storage = {
  getAll,
  getById,
};
