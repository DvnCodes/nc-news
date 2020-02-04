const { fetchArticle, updateVotes } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id).then(article => {
    res.status(200).send(article);
  });
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(article_id, inc_votes).then(article => {
    console.log(article);

    res.status(200).send(article);
  });

  // article.votes += inc_votes;
  // res.status(200).send({ article: article });
};
