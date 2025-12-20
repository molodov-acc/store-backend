const fs = require("fs");
const path = require("path");

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

module.exports = { read, write };
