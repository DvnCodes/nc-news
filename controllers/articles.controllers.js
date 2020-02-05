const {
  fetchArticles,
  fetchArticle,
  updateArticleVotes,
  articleExists
} = require("../models/articles.models");

const { insertComment, fetchComments } = require("../models/comments.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send(articles);
    })
    .catch(err => next(err));
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    return next({ status: 400, msg: "Bad request" });
  }
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => next(err));
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  if (!comment.username || !comment.body) {
    return next({ status: 400, msg: "Bad request" });
  }
  insertComment(article_id, comment)
    .then(comment => {
      res.status(201).send(comment);
    })
    .catch(err => next(err));
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchComments(article_id, sort_by, order)
    .then(comments => {
      articleExists(article_id).then(bool => {
        if (!bool && !comments.length) {
          return next({ status: 404, msg: "Article not found" });
        }
        res.status(200).send({ comments: comments });
      });
    })
    .catch(err => next(err));
};
