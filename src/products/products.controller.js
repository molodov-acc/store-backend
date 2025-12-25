const service = require("./products.service");
const AppError = require("../errors/AppError");

exports.getAll = (req, res) => {
  const products = service.getAll(req.query);
  res.json(products);
};

exports.getById = (req, res) => {
  const product = service.getById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
};

exports.uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(
        "No file uploaded. Please make sure to send the file with the field name 'image'",
        400
      );
    }

    const imagePath = `/images/products/${req.file.filename}`;
    const product = service.updateImage(req.params.id, imagePath);

    res.json({
      message: "Image uploaded successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
