const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    throw new AppError("Unauthorized", 401);
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
};
