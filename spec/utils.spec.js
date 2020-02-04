const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes a timestamp and formats it to be sql compatible", () => {
    expect(
      formatDates([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("creates a reference object with key: val ---> title: article_id from a list of articles", () => {
    expect(
      makeRefObj([
        {
          article_id: 7,
          title: "Z",
          body: "I was hungry.",
          votes: 0,
          topic: "mitch",
          author: "icellusedkars"
        },
        {
          article_id: 9999,
          title: "XXXXXX",
          body: "I was hungry.",
          votes: 0,
          topic: "mitch",
          author: "icellusedkars"
        }
      ])
    ).eql({ Z: 7, XXXXXX: 9999 });
  });
});

describe("formatComments", () => {
  it("takes an array of comment objects (`comments`) and a reference object, and returns a new array of formatted comments. - changes 'belongs to' to article ID", () => {
    const comments = [
      {
        body: "The owls are not what they seem.",
        belongs_to: "a",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "b",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389
      }
    ];
    const refObj = { a: 1, b: 2 };

    expect(formatComments(comments, refObj)).to.eql([
      {
        body: "The owls are not what they seem.",
        article_id: 1,
        author: "icellusedkars",
        votes: 20,
        created_at: new Date(1006778163389)
      },
      {
        body: "This morning, I showered for nine minutes.",
        article_id: 2,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(975242163389)
      }
    ]);
  });
});
