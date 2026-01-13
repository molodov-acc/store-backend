import { storage } from "./brands.storage";

const getAll = () => storage.getAll();

export const service = {
  getAll,
};
