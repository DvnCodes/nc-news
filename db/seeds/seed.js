const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = knex => {
  //knex rollback and migrate to ensure database is up to date
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      //declare promises that need to happen together
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      //use promise all to insert both lots of data together
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          // use util func to get data into correct format
          const articleDataFormatted = formatDates(articleData);
          //insert formatted data to article table and return rows

          return knex("articles")
            .insert(articleDataFormatted)
            .returning("*");
        })
        .then(articleRows => {
          //again formatting using utils
          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          //insert formatted data and return rows

          return knex("comments")
            .insert(formattedComments)
            .returning("*");
        });
    });
};
