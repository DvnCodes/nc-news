const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = knex => {
  //declare promises that need to happen together
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);
  //use promise all to insert both lots of data together
  return Promise.all([topicsInsertions, usersInsertions])
    .then(() => {
      console.log("inserting topics and users...");
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
};
