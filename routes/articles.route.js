const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  patchVotes,
  postComment,
  getComments
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchVotes);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments);

module.exports = articlesRouter;
