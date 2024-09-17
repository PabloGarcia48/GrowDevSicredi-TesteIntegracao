import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { knexClient } from "src/config/knex-db";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import appEnvs from "src/config/env";

export class AuthController {
  async login(request: Request, response: Response) {
    const input = request.body;

    if (!input.email || !input.password) {
      return response.status(400).json({ message: "Requisição inválida" });
    }

    const user = await knexClient
      .table("users")
      .where("email", input.email)
      .first();

    if (!user) {
      return response
        .status(401)
        .json({ message: "E-mail ou senha não conforem" });
    }

    const isCorrectPass = await bcrypt.compare(input.password, user.password);

    if (!isCorrectPass) {
      return response
        .status(401)
        .json({ message: "E-mail ou senha não conforem" });
    }

    if (!user.enable) {
      return response.status(400).json({ message: "Usuário desabilitado" });
    }

    const token = jwt.sign({ userId: user.id }, appEnvs.JWT_SECRET, {
      expiresIn: "1h",
    });

    return response.status(200).json({
      message: "Login efetuado",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          enable: user.enable,
        },
        accessToken: token,
      },
    });
  }

  async register(request: Request, response: Response) {
    const input = request.body;

    if (!input.name || !input.email || !input.password) {
      return response.status(400).json({ message: "Requisição inválida" });
    }

    if (input.password.length < 6) {
      return response.status(400).json({ message: "Senha muito curta" });
    }

    const userAlreadExist = await knexClient
      .table("users")
      .where("email", input.email)
      .first();

    if (userAlreadExist) {
      return response.status(400).json({ message: "Usuário já existe" });
    }

    const password = await bcrypt.hash(input.password, appEnvs.HASH_SALT);

    await knexClient.table("users").insert({
      name: input.name,
      email: input.email,
      id: randomUUID(),
      password,
    });

    const userCreated = await knexClient
      .table("users")
      .where("email", input.email)
      .first();

    return response.status(201).json({
      message: "Usuário criado",
      data: {
        id: userCreated!.id,
        name: userCreated!.name,
        email: userCreated!.email,
        enable: userCreated!.enable,
      },
    });
  }
}
