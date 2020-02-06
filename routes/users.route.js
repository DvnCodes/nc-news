const usersRouter = require("express").Router();
const { getUser } = require("../controllers/users.controllers");
const { methodNotAllowed } = require("../errors/error_functions");

usersRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
