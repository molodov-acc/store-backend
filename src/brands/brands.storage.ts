import { fileDb } from "../utils/fileDb";
const FILE = "brands.json";

const getAll = () => fileDb.read(FILE) || [];
const create = (brand: { id: string; name: string }) => {
  const brands = exports.getAll();
  brands.push(brand);
  fileDb.write(FILE, brands);

  return brand;
};

export const storage = {
  getAll,
  create,
};
