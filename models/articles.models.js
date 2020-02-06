const connection = require("../db/connection");
const { fetchCommentsByArticleID } = require("../models/comments.models");
const { userExists } = require("../models/users.models");
const { topicExists } = require("../models/topics.models");

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  if (order !== "asc" && order !== "desc") {
    order = "desc";
  }
  return connection("articles")
    .returning("*")
    .modify(chain => {
      if (author) {
        return chain.where({ author });
      }
      if (topic) {
        return chain.where({ topic });
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
            return { articles: "No articles found by user" };
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
            return { articles: "No articles found by topic" };
          });
        }
      }

      articles.forEach(article => {
        const id = article.article_id;
        comment_count = fetchCommentsByArticleID(id);
        article.comment_count = comment_count;
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

exports.updateArticleVotes = (article_id, inc_votes) => {
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
