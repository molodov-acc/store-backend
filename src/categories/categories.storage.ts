import { fileDb } from "../shared/utils/fileDb";
const FILE = "categories.json";

const getAll = async () => (await fileDb.read(FILE)) || [];

const create = async (category: { id: string; name: string }) => {
  const categories = await getAll();
  categories.push(category);

  await fileDb.write(FILE, categories);

  return category;
};

export const storage = {
  create,
  getAll,
};
