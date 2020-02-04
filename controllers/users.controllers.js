const { fetchUser } = require("../models/users.models");

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(user => {
      if (!user.user) {
        return next({ status: 404, msg: "Not found" });
      }
      res.status(200).send(user);
    })
    .catch(err => next(err));
};
