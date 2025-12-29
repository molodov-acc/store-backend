import { fileDb } from "../shared/utils/fileDb";
const FILE = "brands.json";

const getAll = async () => (await fileDb.read(FILE)) || [];

const create = async (brand: { id: string; name: string }) => {
  const brands = await getAll();
  brands.push(brand);
  await fileDb.write(FILE, brands);

  return brand;
};

export const storage = {
  getAll,
  create,
};
