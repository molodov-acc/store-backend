import { storage } from "./categories.storage";

const getAll = () => storage.getAll();
const create = (name: string) =>
  storage.create({ id: Date.now().toString(), name });

export const service = {
  getAll,
  create,
};
