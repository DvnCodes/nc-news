const connection = require("../db/connection");

exports.fetchCommentsByArticleID = id => {
  return connection
    .select()
    .table("comments")
    .where("article_id", "=", id)
    .then(comments => {
      return comments;
    });
};

exports.fetchArticle = id => {
  return connection
    .select()
    .table("articles")
    .where("article_id", "=", id)
    .then(article => {
      return Promise.all([article, exports.fetchCommentsByArticleID(id)]);
    })
    .then(([article, comments]) => {
      article[0].comment_count = comments.length;
      return { article: article[0] };
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return connection("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(article => {
      return Promise.all([
        article,
        exports.fetchCommentsByArticleID(article_id)
      ]);
    })
    .then(([article, comments]) => {
      article[0].comment_count = comments.length;
      return { article: article[0] };
    });
};

exports.insertComment = (article_id, comment) => {
  comment.article_id = article_id;
  comment.author = comment.username;
  delete comment.username;

  return connection
    .insert(comment)
    .into("comments")
    .where({ article_id })
    .returning("*")
    .then(comment => {
      return { comment: comment[0] };
    });
};

exports.fetchComments = article_id => {
  return connection("comments").where({ article_id });
};
