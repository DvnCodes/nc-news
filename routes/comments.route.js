const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComment
} = require("../controllers/comments.controllers");

const { methodNotAllowed } = require("../errors/error_functions");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComment)
  .all(methodNotAllowed);

module.exports = commentsRouter;
