const { fetchUser, fetchUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => next(err));
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      if (!user.user) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};
