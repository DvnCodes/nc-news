const {
  fetchArticles,
  fetchArticle,
  updateArticleVotes,
  articleExists,
  addArticle,
  removeArticle,
} = require("../models/articles.models");

const { insertComment, fetchComments } = require("../models/comments.models");

exports.getArticles = (req, res, next) => {
  const queries = req.query;
  fetchArticles(queries)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => next(err));
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  if (!comment.username || !comment.body) {
    return next({ status: 400, msg: "Bad request" });
  }
  insertComment(article_id, comment)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => next(err));
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const queries = req.query;

  fetchComments(article_id, queries)
    .then((comments) => {
      return articleExists(article_id).then((bool) => {
        if (!bool && !comments.length) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        }
        res.status(200).send({ comments: comments });
      });
    })
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const article = req.body;
  // if (!article.title || !article.body || !article.topic || !article.author) {
  //   return next({ status: 400, msg: "Bad request" });
  // }
  addArticle(article)
    .then((article) => {
      res.status(201).send(article);
    })
    .catch((err) => next(err));
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then((response) => {
      if (response === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      res.status(204).send();
    })
    .catch((err) => next(err));
};
