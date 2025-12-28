import { fileDb } from "../utils/fileDb";

const getAll = () => fileDb.read("products.json");

const getById = (productId: string) =>
  fileDb.read("products.json").find(({ id }) => id === productId);

export const storage = {
  getAll,
  getById,
};
