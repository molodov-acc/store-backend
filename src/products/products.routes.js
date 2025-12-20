const { Router } = require("express");
const controller = require("./products.controller");
const validateQuery = require("../middlewares/validateQuery");

const router = Router();

router.get("/", validateQuery, controller.getAll);
router.get("/:id", controller.getById);

module.exports = router;
