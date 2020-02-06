const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection
    .select("*")
    .table("topics")
    .then(topics => {
      return { topics: topics };
    });
};

exports.topicExists = slug => {
  return connection
    .select()
    .table("topics")
    .where({ slug })
    .then(topic => {
      if (topic.length) {
        return true;
      }
      return false;
    });
};
