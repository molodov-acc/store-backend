import { Cart } from "./types";

const getAll = async () => [];

const getByUserId = async (userId: string) => {
  const carts = (await getAll()) as Cart[];

  return carts.find((c) => c.userId === userId) || { userId, items: [] };
};

export const storage = {
  getByUserId,
};
