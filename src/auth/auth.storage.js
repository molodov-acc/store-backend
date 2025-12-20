const fileDb = require("../utils/fileDb");

const FILE = "users.json";

exports.getAll = () => {
  return fileDb.read(FILE) || [];
};

exports.findByEmail = (email) => {
  return exports.getAll().find((user) => user.email === email);
};

exports.create = (user) => {
  const users = exports.getAll();
  users.push(user);
  fileDb.write(FILE, users);
  return user;
};
