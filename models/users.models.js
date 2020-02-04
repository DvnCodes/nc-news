const connection = require("../db/connection");

exports.fetchUser = username => {
  return connection
    .select()
    .table("users")
    .where("username", "=", username)
    .then(user => {
      return { user: user[0] };
    });
};
