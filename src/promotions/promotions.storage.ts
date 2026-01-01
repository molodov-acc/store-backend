import { randomUUID } from "crypto";
import { fileDb } from "../shared/utils/fileDb";
import { CreatePromotion, Promotion } from "./types";
const FILE = "promotions.json";

const getAll = async (): Promise<Promotion[]> => {
  const promotions = await fileDb.read(FILE);
  return promotions ?? [];
};
const create = async (data: CreatePromotion) => {
  const promotions = await getAll();

  const promotion = {
    id: randomUUID(),
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  promotions.push(promotion);
  await fileDb.write(FILE, promotions);

  return promotion;
};

export const storage = {
  getAll,
  create,
};
