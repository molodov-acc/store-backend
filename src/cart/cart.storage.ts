import { fileDb } from "../utils/fileDb";
const FILE = "carts.json";

const getAll = () => fileDb.read(FILE) || [];

const getByUserId = (userId: string) => {
  const carts = getAll();
  return carts.find((c) => c.userId === userId) || { userId, items: [] };
};

const save = (cart) => {
  const carts = getAll();
  const index = carts.findIndex((c) => c.userId === cart.userId);

  if (index === -1) {
    carts.push(cart);
  } else {
    carts[index] = cart;
  }

  fileDb.write(FILE, carts);
  return cart;
};

export const storage = {
  getByUserId,
  save,
};
