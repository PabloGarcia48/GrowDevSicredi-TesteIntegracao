import { describe, it } from "node:test";
import supertest from "supertest";
import app from "../../src/app";
import { deepStrictEqual, ok, strictEqual } from "node:assert";
import { knexClient } from "../../src/config/knex-db";
import { randomBytes, randomUUID } from "node:crypto";

describe("HTTP - /api/register", () => {
  it("Deve retornar 400 quando email não for enviado", async () => {
    const input = {
      email: "",
      name: "any",
      password: "any password",
    };

    const resonse = await supertest(app).post("/api/register").send(input);

    strictEqual(resonse.status, 400);
    deepStrictEqual(resonse.body, { message: "Requisição inválida" });
  });

  it("Deve retornar 400 quando nome não for enviado", async () => {
    const input = {
      email: "any@teste.com",
      name: "",
      password: "any password",
    };

    const resonse = await supertest(app).post("/api/register").send(input);

    strictEqual(resonse.status, 400);
    deepStrictEqual(resonse.body, { message: "Requisição inválida" });
  });

  it("Deve retornar 400 quando a senha não for enviada", async () => {
    const input = {
      email: "any@teste.com",
      name: "any name",
      password: "",
    };

    const resonse = await supertest(app).post("/api/register").send(input);

    strictEqual(resonse.status, 400);
    deepStrictEqual(resonse.body, { message: "Requisição inválida" });
  });

  it("Deve retornar 400 quando o tamanho da senha não for atendido", async () => {
    const input = {
      email: "any@teste.com",
      name: "any name",
      password: "12345",
    };

    const resonse = await supertest(app).post("/api/register").send(input);

    strictEqual(resonse.status, 400);
    deepStrictEqual(resonse.body, { message: "Senha muito curta" });
  });

  it("Deve retornar 400 quando o usuário já existir", async () => {
    await knexClient.table("users").delete();

    const input = {
      email: "any@teste.com",
      name: "any name",
      password: "123456",
    };

    await knexClient.table("users").insert({
      email: input.email,
      name: input.name,
      password: input.password,
      id: randomUUID(),
    });

    const resonse = await supertest(app).post("/api/register").send(input);

    strictEqual(resonse.status, 400);
    deepStrictEqual(resonse.body, { message: "Usuário já existe" });
  });

  it("Deve retornar 201 quando o usuário é criado", async () => {
    await knexClient.table("users").delete();

    const input = {
      email: "any@teste.com",
      name: "any name",
      password: "123456",
    };

    const resonse = await supertest(app).post("/api/register").send(input);

    const userDB = await knexClient
      .table("users")
      .where("email", input.email)
      .first();

    ok(userDB);

    strictEqual(resonse.status, 201);
    deepStrictEqual(resonse.body, {
      message: "Usuário criado",
      data: {
        id: userDB.id,
        name: input.name,
        email: input.email,
        enable: 1,
      },
    });
  });
});
