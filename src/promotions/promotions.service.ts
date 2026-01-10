import { getAllPromotions } from "./promotions.repository";

const getAll = () => getAllPromotions();

export const service = {
  getAll,
};
