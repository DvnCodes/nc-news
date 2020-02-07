const connection = require("../db/connection");
const { fetchCommentsByArticleID } = require("../models/comments.models");
const { userExists } = require("../models/users.models");
const { topicExists } = require("../models/topics.models");

exports.fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  p,
  limit = 10
}) => {
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }

  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(chain => {
      if (limit !== undefined) {
        chain.limit(limit);
      }
      if (p !== undefined) {
        chain.offset((limit / 2) * p);
      }
      if (author !== undefined) {
        chain.where("username" === author);
      }
      if (topic !== undefined) {
        chain.andWhere({ topic });
      }
    })
    .orderBy(sort_by, order)
    .then(articles => {
      if (!articles.length) {
        if (author) {
          return userExists(author).then(bool => {
            if (!bool) {
              return Promise.reject({
                status: 404,
                msg: "Author does not exist"
              });
            }
            return { articles: [] };
          });
        }
        if (topic) {
          return topicExists(topic).then(bool => {
            if (!bool) {
              return Promise.reject({
                status: 404,
                msg: "Topic does not exist"
              });
            }
            return { articles: [] };
          });
        }
      }
      articles.forEach(article => {
        delete article.body;
      });
      return { articles: articles };
    });
};

exports.fetchArticle = id => {
  return connection
    .select()
    .table("articles")
    .where("article_id", "=", id)
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return Promise.all([article, fetchCommentsByArticleID(id)]);
    })
    .then(([article, comments]) => {
      article[0].comment_count = comments.length;
      return { article: article[0] };
    });
};

exports.updateArticleVotes = (article_id, inc_votes = 0) => {
  return connection("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      return Promise.all([article, fetchCommentsByArticleID(article_id)]);
    })
    .then(([article, comments]) => {
      article[0].comment_count = comments.length;
      return { article: article[0] };
    });
};

exports.articleExists = id => {
  return connection
    .select()
    .table("articles")
    .where("article_id", "=", id)
    .then(article => {
      if (article.length) {
        return true;
      }
      return false;
    });
};
