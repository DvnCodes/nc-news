const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers");
const { methodNotAllowed } = require("../errors/error_functions");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
