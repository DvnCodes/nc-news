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

//   [{
//     body: 'This morning, I showered for nine minutes.',
//     belongs_to: 'Living in the shadow of a great man',
//     created_by: 'butter_bridge',
//     votes: 16,
//     created_at: 975242163389
//   }
// ]

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    //new object to prevent mutation
    newComment = { ...comment };
    //set new key article id using value from refobj
    newComment.article_id = articleRef[newComment.belongs_to];
    //set author using created_by
    newComment.author = newComment.created_by;
    //convert unix date into js obj
    newComment.created_at = new Date(newComment.created_at);
    //delete unwanted proeprties
    delete newComment.belongs_to;
    delete newComment.created_by;
    return newComment;
  });
};
