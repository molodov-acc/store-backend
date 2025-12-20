const service = require("./auth.service");

exports.register = async (req, res) => {
  const token = await service.register(req.body);
  res.json({ token });
};

exports.login = async (req, res) => {
  const token = await service.login(req.body);
  res.json({ token });
};
