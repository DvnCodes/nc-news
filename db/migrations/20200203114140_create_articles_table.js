exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
    console.log("creating articles table...");

    articlesTable.increments("article_id").primary();

    articlesTable.string("title").notNullable();

    articlesTable.text("body").notNullable();

    articlesTable.integer("votes").defaultTo(0);

    articlesTable.string("topic").notNullable();

    articlesTable.string("author").notNullable();

    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());

    articlesTable
      .foreign("topic")
      .references("slug")
      .inTable("topics");

    articlesTable
      .foreign("author")
      .references("username")
      .inTable("users");
  });
};

exports.down = function(knex) {
  console.log("removing articles table");
  return knex.schema.dropTable("articles");
};
