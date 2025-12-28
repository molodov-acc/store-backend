import fs from "fs";
import path from "path";

// Чтение JSON
const read = (file) => {
  const filePath = path.join(__dirname, "..", "..", "data", file);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

// Запись JSON
const write = (file, data) => {
  const filePath = path.join(__dirname, "..", "..", "data", file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const fileDb = { read, write };
