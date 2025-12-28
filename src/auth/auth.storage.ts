import { fileDb } from "../shared/utils/fileDb";
import { User } from "./types";

const FILE = "users.json";

const getAll = async (): Promise<User[]> => {
  const data = (await fileDb.read(FILE)) ?? [];
  return data;
};

const findByEmail = async (email: string): Promise<User | undefined> => {
  const users = await getAll();
  return users.find((user: User) => user.email === email);
};

const create = async (user: User): Promise<User> => {
  const users = await getAll();
  users.push(user);

  await fileDb.write(FILE, users);

  return user;
};

export const storage = {
  findByEmail,
  create,
};
