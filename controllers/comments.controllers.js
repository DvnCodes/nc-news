const {
  updateCommentVotes,
  removeComment
} = require("../models/comments.models");

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes && typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Bad request" });
  }
  updateCommentVotes(inc_votes, comment_id)
    .then(comment => {
      res.status(200).send(comment);
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(response => {
      if (response === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      res.status(204).send();
    })
    .catch(err => next(err));
};
