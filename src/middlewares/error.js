const multer = require("multer");

module.exports = (err, req, res, next) => {
  // Обработка ошибок multer
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
};
