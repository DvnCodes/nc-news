const usersRouter = require("express").Router();
const { getUser, getUsers } = require("../controllers/users.controllers");
const { methodNotAllowed } = require("../errors/error_functions");

usersRouter.route("/").get(getUsers).all(methodNotAllowed);

usersRouter.route("/:username").get(getUser).all(methodNotAllowed);

module.exports = usersRouter;
