const connection = require("../db/connection");

exports.fetchUsers = () => {
  return connection
    .select("*")
    .table("users")
    .then((users) => {
      return { users };
    });
};

exports.fetchUser = (username) => {
  return connection
    .select()
    .table("users")
    .where("username", "=", username)
    .then((user) => {
      return { user: user[0] };
    });
};

exports.userExists = (username) => {
  return connection
    .select()
    .table("users")
    .where({ username })
    .then((user) => {
      if (user.length) {
        return true;
      }
      return false;
    });
};
