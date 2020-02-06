const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  patchArticleVotes,
  postComment,
  getComments
} = require("../controllers/articles.controllers");

const { methodNotAllowed } = require("../errors/error_functions");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .put(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .put(methodNotAllowed);

module.exports = articlesRouter;
