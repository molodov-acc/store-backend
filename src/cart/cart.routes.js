const router = require("express").Router();
const controller = require("./cart.controller");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, controller.getCart);
router.post("/", authMiddleware, controller.addToCart);
router.post("/clear", authMiddleware, controller.clearCart);
router.delete("/:productId", authMiddleware, controller.removeFromCart);

module.exports = router;
