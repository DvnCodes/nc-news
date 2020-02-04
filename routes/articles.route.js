const articlesRouter = require("express").Router();
const {
  getArticle,
  patchVotes,
  postComment,
  getComments
} = require("../controllers/articles.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchVotes);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments);

module.exports = articlesRouter;
