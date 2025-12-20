const AppError = require("../errors/AppError");

const validGenders = ["male", "female"];
const validCategories = ["snowboard", "ski", "boots", "clothes"];

module.exports = (req, res, next) => {
  const { gender, category } = req.query;

  if (gender && !validGenders.includes(gender)) {
    throw new AppError(`Invalid gender: ${gender}`, 400);
  }

  if (category && !validCategories.includes(category)) {
    throw new AppError(`Invalid category: ${category}`, 400);
  }

  next();
};
