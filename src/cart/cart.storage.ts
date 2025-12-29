import { fileDb } from "../shared/utils/fileDb";
import { Cart } from "./types";
const FILE = "carts.json";

const getAll = async () => (await fileDb.read(FILE)) || [];

const getByUserId = async (userId: string) => {
  const carts = (await getAll()) as Cart[];

  return carts.find((c) => c.userId === userId) || { userId, items: [] };
};

const save = async (cart: Cart) => {
  const carts = (await getAll()) as Cart[];

  const index = carts.findIndex((c) => c.userId === cart.userId);

  if (index === -1) {
    carts.push(cart);
  } else {
    carts[index] = cart;
  }

  await fileDb.write(FILE, carts);
  return cart;
};

export const storage = {
  getByUserId,
  save,
};
