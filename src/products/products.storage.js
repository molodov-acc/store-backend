const { read } = require("../utils/fileDb");

exports.getAll = () => read("products.json");

exports.getById = (id) => read("products.json").find((p) => p.id === id);
