const service = require("./brands.service");

exports.getAll = (req, res) => res.json(service.getAll());
exports.create = (req, res) => res.json(service.create(req.body.name));
