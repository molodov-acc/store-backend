import { storage } from "./categories.storage";

const getAll = async () => await storage.getAll();

export const service = {
  getAll,
};
