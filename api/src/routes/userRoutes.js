const { Router } = require("express");

const postUserHandler = require("../handlers/userHandlers/postUserHandler.js");
const loginUserHandler = require("../handlers/userHandlers/loginUserHandler.js");
const getUsersHandler = require("../handlers/userHandlers/getUsersHandler.js");

const userRouter = Router();

userRouter.post("/", postUserHandler);
userRouter.post("/login", loginUserHandler);
userRouter.get("/", getUsersHandler);

module.exports = userRouter;