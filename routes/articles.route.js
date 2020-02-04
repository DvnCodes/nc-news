const articlesRouter = require("express").Router();
const {
  getArticle,
  patchVotes
} = require("../controllers/articles.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchVotes);

module.exports = articlesRouter;
