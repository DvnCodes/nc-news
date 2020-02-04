const connection = require("../db/connection");

exports.fetchTopics = () => {
  console.log("in model......");

  return connection
    .select("*")
    .table("topics")
    .then(topics => {
      return { topics: topics };
    });
};
