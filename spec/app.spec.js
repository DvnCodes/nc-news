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
  describe("/articles", () => {
    it("GET 200: responds with an array of article objects sorted by date desc by default", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
          expect(body.articles).to.be.descendingBy("created_at");
        });
    });
    it("GET 200: responds with an array of article objects sorted/ordered and filtered by author or topic using given queries", () => {
      return request(app)
        .get(
          "/api/articles?sorted_by=votes&order=asc&author=butter_bridge&topic=mitch"
        )
        .then(({ body }) => {
          body.articles.forEach(article => {
            expect(article).to.have.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(article.author).to.eql("butter_bridge");
            expect(article.topic).to.eql("mitch");
          });
          expect(body.articles).to.be.ascendingBy("votes");
        });
    });
    describe("/:article_id", () => {
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
            .send({
              username: "lurker",
              body: "testing..."
            })
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
        it("GET 200: responds with an array of comments for given article_id, sorted by created_at by default, ordered desc by default", () => {
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
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
            });
        });
        it("GET 200: responds with an array of comments for given article_id, sorted and ordered by given queries", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
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
                expect(body.comments).to.be.sortedBy("votes", {
                  ascending: true
                });
              });
            });
        });
      });
    });
  });
});
