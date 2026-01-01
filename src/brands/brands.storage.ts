import { fileDb } from "../shared/utils/fileDb";
const FILE = "brand.json";

const getAll = async () => {
  const data = await fileDb.read(FILE);
  return data ?? [];
};

export const storage = {
  getAll,
};
