import { fileDb } from "../utils/fileDb";
const FILE = "categories.json";

const getAll = () => fileDb.read(FILE) || [];

const create = (category: { id: string; name: string }) => {
  const categories = getAll();
  categories.push(category);
  fileDb.write(FILE, categories);

  return category;
};

export const storage = {
  create,
  getAll,
};
