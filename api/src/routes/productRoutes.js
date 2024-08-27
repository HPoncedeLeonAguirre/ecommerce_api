const { Router } = require("express");

const postProductHandler = require('../handlers/productHandlers/postProductHandler.js'); 

const productRouter = Router();

productRouter.post("/", postProductHandler);

module.exports = productRouter;