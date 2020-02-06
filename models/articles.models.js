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
  //check order is one of two values as pswl will not catch this error
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
      //modify the chain to add .where for queries
      if (author !== undefined) {
        chain.where("username" === author);
      }
      if (topic !== undefined) {
        chain.andWhere({ topic });
      }
    }) //sort using queries or defaults
    .orderBy(sort_by, order)
    .then(articles => {
      //if the array is empty
      if (!articles.length) {
        //and author is given
        if (author) {
          //return a promise containing boolean for users existence
          return userExists(author).then(bool => {
            if (!bool) {
              //if they dont exist, send a reject
              return Promise.reject({
                status: 404,
                msg: "Author does not exist"
              });
            }
            //otherwise they do exist but have not posted any articles, so send non-error message
            // return { articles: ["No articles found by user" ]};
            return { articles: [] };
          });
        }
        if (topic) {
          //same process as above for topics
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
        //   const id = article.article_id;
        //   comment_count = fetchCommentsByArticleID(id);
        //   article.comment_count = comment_count;
        delete article.body;
      });
      return { articles: articles };
    });
};

exports.fetchArticle = id => {
  //retrieve the article for given id
  return connection
    .select()
    .table("articles")
    .where("article_id", "=", id)
    .then(article => {
      //if it's an empty array, the article does not exist
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      //else, format the article and return it
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
