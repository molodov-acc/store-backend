const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const controller = require("./products.controller");
const validateQuery = require("../middlewares/validateQuery");

const router = Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/products/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Проверяем наличие файла
    if (!file) {
      return cb(new Error("No file provided"));
    }
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed! (jpeg, jpg, png, gif, webp)"));
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

router.get("/", validateQuery, controller.getAll);
router.get("/:id", controller.getById);

// Middleware для обработки ошибок multer
const handleMulterError = (err, req, res, next) => {
  console.error("Multer error:", err);
  console.error("Request content-type:", req.headers["content-type"]);
  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected field. Use 'image' as the field name." });
    }
    return res.status(400).json({ 
      message: `Multer error: ${err.message}`,
      code: err.code 
    });
  }
  if (err) {
    return res.status(400).json({ 
      message: err.message,
      error: err.toString()
    });
  }
  next();
};

router.post("/:id/image", upload.single("image"), handleMulterError, controller.uploadImage);

module.exports = router;
