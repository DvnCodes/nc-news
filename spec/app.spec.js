process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

describe("/api", () => {
  after(() => connection.destroy());

  beforeEach(() => {
    return connection.seed.run();
  });

  describe("/topics", () => {
    it("GET 200: Responds with all topics in correct format", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          response.body.topics.forEach(topic => {
            expect(topic).to.have.keys("slug", "description");
          });
        });
    });
  });
  describe("/users/:username", () => {
    it("GET 200: responds with a user object in the correct format", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(response => {
          expect(response.body).to.eql({
            user: {
              username: "lurker",
              name: "do_nothing",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            }
          });
        });
    });
  });

  describe.only("/articles/:article_id", () => {
    it("GET 200: responds with an article onject in the correct format", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            "article_id",
            "author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it.only("PATCH 200: accepts a inc_votes object, updates the votes property and responds with the updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(response => {
          expect(response.body.article).to.have.keys(
            "article_id",
            "author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
  });
});
