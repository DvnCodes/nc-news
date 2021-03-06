const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  patchArticleVotes,
  postComment,
  getComments,
  postArticle,
  deleteArticle
} = require("../controllers/articles.controllers");

const { methodNotAllowed } = require("../errors/error_functions");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(methodNotAllowed);

module.exports = articlesRouter;
