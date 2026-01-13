import { storage } from "./promotions.storage";
import { CreatePromotion } from "./types";

const getAll = () => storage.getAll();

// TODO добавить проверку входных данных на бизнес логику
const create = async (data: CreatePromotion) => await storage.create(data);

export const service = {
  getAll,
  create,
};
