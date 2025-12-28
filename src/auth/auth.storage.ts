import { fileDb } from "../utils/fileDb";
import { User } from "./types";

const FILE = "users.json";

const getAll = () => {
  return fileDb.read(FILE) || [];
};

const findByEmail = (email: string) => {
  return getAll().find((user: User) => user.email === email);
};

const create = (user: User) => {
  const users = getAll();
  users.push(user);
  fileDb.write(FILE, users);

  return user;
};

export const storage = {
  findByEmail,
  create,
};
