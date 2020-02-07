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
  { sort_by = "created_at", order = "desc", limit = 10, p }
) => {
  return connection("comments")
    .where({ article_id })
    .orderBy(sort_by, order)
    .limit(limit)
    .modify(chain => {
      if (p) {
        chain.offset((limit / 2) * p);
      }
    });
};

exports.updateCommentVotes = (inc_votes = 0, comment_id) => {
  return connection("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return { comment: comment[0] };
    });
};

exports.removeComment = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deletedRows => deletedRows);
};

exports.commentExists = id => {
  return connection
    .select()
    .table("comments")
    .where("comment_id", "=", id)
    .then(comment => {
      if (comment.length) {
        return true;
      }
      return false;
    });
};
