exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
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
  return knex.schema.dropTable("articles");
};
