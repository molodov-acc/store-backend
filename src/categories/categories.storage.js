const fileDb = require("../utils/fileDb");
const FILE = "categories.json";

exports.getAll = () => fileDb.read(FILE) || [];
exports.create = (category) => {
  const categories = exports.getAll();
  categories.push(category);
  fileDb.write(FILE, categories);
  return category;
};
