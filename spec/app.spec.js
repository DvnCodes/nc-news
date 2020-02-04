process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
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

  describe("/articles/:article_id", () => {
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
    it("PATCH 200: accepts a inc_votes object, updates the votes property and responds with the updated article", () => {
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
    describe("/comments", () => {
      it("POST 201: accepts a valid comment, posts it, and responds with it", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "lurker", body: "testing..." })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("GET 200: responds with an array of comments for given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            body.comments.forEach(comment => {
              expect(comment).have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
            });
          });
      });
    });
  });
});
