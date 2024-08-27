const { Router } = require("express");

const userRouter = require("./userRoutes");
const orderRouter = require("./orderRoutes")
const productRouter = require("./productRoutes");

const router = Router();

router.use("/users", userRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);

module.exports = router;