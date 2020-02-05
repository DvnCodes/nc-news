const {
  updateCommentVotes,
  removeComment
} = require("../models/comments.models");

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotes(inc_votes, comment_id)
    .then(comment => {
      console.log(comment);
      res.status(200).send(comment);
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(response => res.status(204).send())
    .catch(err => next(err));
};
