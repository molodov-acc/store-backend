const storage = require("./categories.storage");

exports.getAll = () => storage.getAll();
exports.create = (name) => storage.create({ id: Date.now().toString(), name });
