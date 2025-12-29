import { randomUUID } from "crypto";
import { storage } from "./categories.storage";

const getAll = async () => await storage.getAll();
const create = async (name: string) =>
  await storage.create({ id: randomUUID(), name });

export const service = {
  getAll,
  create,
};
