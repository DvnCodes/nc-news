exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    console.log("creating topics table...");

    topicsTable
      .string("slug")
      .primary()
      .unique()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing topics table");

  return knex.schema.dropTable("topics");
};
