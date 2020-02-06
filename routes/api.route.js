const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics.route");
const usersRouter = require("../routes/users.route");
const articlesRouter = require("../routes/articles.route");
const commentsRouter = require("../routes/comments.route");
const { getDescription } = require("../controllers/api.controllers");

const { methodNotAllowed } = require("../errors/error_functions");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(getDescription)
  .all(methodNotAllowed);

module.exports = apiRouter;
