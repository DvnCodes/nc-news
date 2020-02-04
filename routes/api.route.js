const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics.route");
const usersRouter = require("../routes/users.route");
const articlesRouter = require("../routes/articles.route");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
module.exports = apiRouter;
