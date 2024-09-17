import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id", { primaryKey: true });
    table.string("name", 100).notNullable();
    table.text("description", "").notNullable().unique();
    table.double("price", 10, 2).notNullable();
    table.boolean("enable").notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("products");
}
