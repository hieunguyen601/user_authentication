import { request } from "supertest";
import { expect, test } from "vitest";
import app from "./app.js";

test("POST /api/signin testing sign in", async () => {
  const createResponse = await request(app).post("/api/signup").send({
    email: "hotboylatao601@gmail.com",
    password: "123456",
  });

  const response = await request(app).post("/api/signin").send({
    email: "hotboylatao601@gmail.com",
    password: "123456",
  });

  expect(createResponse.status).toBe(201);
  expect(response.status).toBe(200);
});

test("PATCH /api/update/:id returning updated password", async () => {
  const createResponse = await request(app).post("/api/signup").send({
    email: "hieunguyen601@gmail.com",
    password: "123456",
  });

  const updatePassword = await request(app)
    .patch(`/api/update/${createResponse.id}`)
    .send({
      password: "654321",
    });

  expect(updatePassword.status).toBe(200);
});

test("DELETE /api/deleteUser/:id returning deleted user", async () => {
  const createResponse = await request(app).post("/api/signup").send({
    email: "hieunguyen123456@gmail.com",
    password: "123456",
  });

  const deleteUSer = await request(app).delete(
    `/api/deleteUser/${createResponse.id}`,
  );
  expect(deleteUSer.status).toBe(200);
});
