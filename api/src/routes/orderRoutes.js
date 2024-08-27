const { Router } = require("express");
const { 
    createOrderValidator, 
    getOrderByIdValidator, 
    getOrdersByUserValidator, 
    updateOrderStatusValidator,
    handleValidationErrors
} = require("../middlewares/dataValidator.js");

const postOrderHandler = require('../handlers/orderHandlers/postOrderHandler.js');
const getOrderByIdHandler = require('../handlers/orderHandlers/getOrderByIdHandler.js');
const getOrdersByUserHandler = require('../handlers/orderHandlers/getOrdersByUserHandler.js');
const updateOrderStatusHandler = require('../handlers/orderHandlers/updateOrderStatusHandler.js');

const authenticateUser = require('../middlewares/authenticationMiddleware.js');
const authorizeAdmin = require('../middlewares/authorizationMiddleware.js');

const orderRouter = Router();

orderRouter.post("/", createOrderValidator, postOrderHandler, handleValidationErrors);
orderRouter.get("/:id_Order", getOrderByIdValidator, authenticateUser, getOrderByIdHandler, handleValidationErrors);
orderRouter.get("/:id_User/orders", getOrdersByUserValidator, authenticateUser, getOrdersByUserHandler, handleValidationErrors);
orderRouter.patch("/:id_Order/status", updateOrderStatusValidator, authenticateUser, authorizeAdmin, updateOrderStatusHandler, handleValidationErrors);

module.exports = orderRouter;