import { randomUUID } from "crypto";
import { storage } from "./brands.storage";

const getAll = () => storage.getAll();
const create = (name: string) => storage.create({ id: randomUUID(), name });

export const service = {
  getAll,
  create,
};
