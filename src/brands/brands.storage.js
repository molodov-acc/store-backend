const fileDb = require("../utils/fileDb");
const FILE = "brands.json";

exports.getAll = () => fileDb.read(FILE) || [];
exports.create = (category) => {
  const categories = exports.getAll();
  categories.push(category);
  fileDb.write(FILE, categories);
  return category;
};
