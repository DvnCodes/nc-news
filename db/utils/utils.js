exports.formatDates = list => {
  return list.map(article => {
    newArticle = { ...article };
    newArticle.created_at = new Date(newArticle.created_at);
    return newArticle;
  });
};

exports.makeRefObj = list => {
  const newObj = {};
  for (let i = 0; i < list.length; i++) {
    newObj[list[i].title] = list[i].article_id;
  }
  return newObj;
};
exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    newComment = { ...comment };
    newComment.article_id = articleRef[newComment.belongs_to];
    newComment.author = newComment.created_by;
    newComment.created_at = new Date(newComment.created_at);
    delete newComment.belongs_to;
    delete newComment.created_by;
    return newComment;
  });
};
