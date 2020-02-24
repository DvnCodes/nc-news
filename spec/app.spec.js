process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
const { expect } = chai;
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const description = require("../endpoints.json");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    connection.destroy();
  });
  it("GET 200: responds with a description of all availbale endpoints in the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.description).to.eql(description);
      });
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
  describe("/articles", () => {
    it("GET 200: responds with an array of article objects sorted by date desc by default", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          // console.log(body);

          body.articles.forEach(article => {
            // console.log(article);

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
          expect(body.articles[0].comment_count).to.eql("13");
          expect(body.articles).to.be.descendingBy("created_at");
        });
    });
    it("GET 200: has a default page limit of 10", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          expect(body.articles.length).to.eql(10);
        });
    });
    it("GET 200: accepts a limit query that sets the page limit of response", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .then(({ body }) => {
          expect(body.articles.length).to.eql(5);
        });
    });
    it("GET 200: accepts a page query (p) that sets at which to start the response at (calculated using limit) ", () => {
      return request(app)
        .get("/api/articles?limit=1&p=12")
        .then(({ body }) => {
          expect(body.articles.length).to.eql(1);
        });
    });
    it("GET 200: there is a total_count property on the response that is a count of the total articles for given request, taking into account filters", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .then(({ body }) => {
          expect(body.total_count).to.eql(12);
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
    it("POST 201: Accepts an article object with title, body, topic and author properties, responds with posted article", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Hello World",
          topic: "mitch",
          body: "Testing post article",
          author: "butter_bridge"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).to.have.keys(
            "article_id",
            "author",
            "title",
            "body",
            "topic",
            "created_at",
            "votes"
          );
        });
    });
    it("DELETE 204: removes given article and returns no content", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204);
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
      it("GET 200: accepts and implements a limit, and page query, default limit is 10", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=3&p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.have.length(3);
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
              // console.log(JSON.stringify(body));

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
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("PATCH 400: returns an error when an invalid comment id is passed", () => {
        return request(app)
          .patch("/api/comments/invalid")
          .send({ inc_votes: -1 })
          .expect(400);
      });
      it("PATCH: 200 accepts a vote increment object and responds with comment after updating its votes property to reflect increment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "article_id",
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          });
      });
      it("DELETE: 204 deletes the given comment and responds with no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
    });
  });

  //ERRORS
  //  |
  //  |
  //  |
  //  V
  describe("ERRORS", () => {
    describe("/", () => {
      it("GET: 404 responds with Not Found for inexistent routes", () => {
        return request(app)
          .get("/not-a-route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Not found");
          });
      });
    });
    describe("/api", () => {
      it("DELETE 405: responds with method not allowed", () => {
        return request(app)
          .delete("/api")
          .expect(405);
      });
    });
    describe("/api/articles", () => {
      it("PATCH,DELETE: reponds with 405 and method not allowed when an unsupported request is made", () => {
        return request(app)
          .post("/api/articles")
          .send({ article: ["article"] })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).eql("Method not allowed");
          });
      });
      // it.only("POST 400: responds with bad request when sent an article without all neccessary properties", () => {
      //   return request(app)
      //     .post("/api/articles")
      //     .send({})
      //     .expect(400);
      // });
      it("GET 400: responds with psql error msg when a sort_by that does not exist is passed", () => {
        return request(app)
          .get("/api/articles?sort_by=banana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("Undefined column");
          });
      });

      it("GET 200: reverts to default order when order query is not asc or desc", () => {
        return request(app)
          .get("/api/articles?order=banana")
          .expect(200);
      });

      it("GET 404: responds with not found when querying an author that does not exist", () => {
        return request(app)
          .get("/api/articles?author=bananaman")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Author does not exist");
          });
      });
      it("GET 404: responds with not found when querying a topic that does not exist", () => {
        return request(app)
          .get("/api/articles?topic=bananas")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Topic does not exist");
          });
      });
      it("GET 200: responds with empty array and no error when no articles exist by queried author", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
      it("GET 200: responds with empty array and no error when no articles exist by queried topic", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
    });
    describe("/api/topics", () => {
      it("PATCH,PUT,DELETE: reponds with 405 and method not allowed when an unsupported request is made", () => {
        return request(app)
          .post("/api/topics")
          .send({ topic: ["topic"] })
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).eql("Method not allowed");
          });
      });
      it("GET 200 ignores a query that does not exist", () => {
        return request(app)
          .get("/api/topics?slug=paper&sort_by=description")
          .expect(200);
      });
    });
    describe("/api/users/:username", () => {
      it("PUT 405: reponds with method not allowed", () => {
        return request(app)
          .put("/api/users/butter_bridge")
          .send({})
          .expect(405);
      });
      it("GET 404: responds with not found when username doesn't exist", () => {
        return request(app)
          .get("/api/users/test_username_xyz")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Not found");
          });
      });
    });
    describe("/api/articles/:article_id", () => {
      it("PUT 405: expect method not allowed when put request is made", () => {
        return request(app)
          .put("/api/articles/1")
          .expect(405);
      });
      it("GET 400: an invalid article id responds with bad request", () => {
        return request(app)
          .get("/api/articles/string")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("Invalid text representation");
          });
      });
      it("GET 404: an inexistent article responds with not found", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Not found");
          });
      });
      // it("PATCH 400: responds with bad request when req does not contain an inc_votes property on body", () => {
      //   return request(app)
      //     .patch("/api/articles/1")
      //     .send({ vote: 1 })
      //     .expect(400)
      //     .then(({ body }) => {
      //       expect(body.msg).to.eql("Bad request");
      //     });
      // });
      it("PATCH 200: responds with no error and unchanged article when given empty body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.keys(
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
      it("PATCH 200: ignores invalid properties on request as long as inc_votes is valid", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "mitch" })
          .expect(200);
      });
      it("PATCH 404: responds with error when comment does not exist", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({})
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Comment does not exist");
          });
      });
      it("PATCH 400: responds with bad request when inc_votes value is invalid", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body }) => {
            ~expect(body.msg).to.eql("Invalid text representation");
          });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      it("PUT 405: responds with method not allowed error", () => {
        return request(app)
          .put("/api/articles/1/comments")
          .send({})
          .expect(405);
      });
      it("POST 404: responds with not found if article does not exist", () => {
        return request(app)
          .post("/api/9999/comments")
          .send({
            username: "NorthCoder94",
            body: "this should be an error..."
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Not found");
          });
      });
      it("POST 400: responds with bad request if post does not contain valid username or body property", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "lurker", notBody: "should not work" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql("Bad request");
          });
      });
      it("POST 404: responds with msg when sent a valid string as username property, but user does not exist ", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "john smith",
            body: "I'm having an existential crisis"
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("User does not exist");
          });
      });
      it("GET 200: When there are no comments on an article, responds with empty comments object", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql({ comments: [] });
          });
      });
      it("GET 404: when the article does not exist, responds with 404 not found error", () => {
        return request(app)
          .get("/api/articles/9999999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Article not found");
          });
      });
    });
    describe("/api/comments/:comment_id", () => {
      it("PUT 405: when put request made", () => {
        return request(app)
          .put("/api/comments/1")
          .send({})
          .expect(405);
      });
      it("PATCH 200: responds with unchanged comment when sent a body without inc_votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ voteinvalid: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.eql(16);
          });
      });
      it("PATCH 200: ignores invalid properties on request as long as inc_votes is valid", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1, name: "mitch" })
          .expect(200);
      });
      // it("PATCH 400: responds with bad request when inc_votes value is invalid", () => {
      //   return request(app)
      //     .patch("/api/comments/1")
      //     .send({ inc_votes: "cat" })
      //     .expect(400)
      //     .then(({ body }) => {
      //       expect(body.msg).to.eql("Invalid text representation");
      //     });
      // });
      it("DELETE 404: responds with relevant message when comment to be deleted does not exist", () => {
        return request(app)
          .delete("/api/comments/99999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("Comment not found");
          });
      });
    });
  });
});
