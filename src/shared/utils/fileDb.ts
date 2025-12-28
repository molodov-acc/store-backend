import fs from "fs/promises";
import path from "path";

// Чтение JSON
const read = async (file: string) => {
  const filePath = path.join(process.cwd(), "data", file);

  try {
    const data = await fs.readFile(filePath, "utf-8");

    return JSON.parse(data);
  } catch (err) {
    throw err;
  }
};

// Запись JSON
const write = async (file: string, data: unknown) => {
  const filePath = path.join(process.cwd(), "data", file);

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    throw err;
  }
};

export const fileDb = { read, write };
