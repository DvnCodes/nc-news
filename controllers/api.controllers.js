const description = require("../endpoints.json");

exports.getDescription = (req, res, next) => {
  res.status(200).send({ description });
};
