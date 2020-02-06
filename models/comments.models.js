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

exports.fetchComments = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.updateCommentVotes = (inc_votes, comment_id) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      return { comment: comment[0] };
    });
};

exports.removeComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deletedRows => deletedRows);
};
