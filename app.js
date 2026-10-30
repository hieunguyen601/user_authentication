import pool from "./db.js";
import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const saltRounds = 12;
  if (!email || !password) {
    return res.status(403).json({
      message: "Email and password are required!",
    });
  }

  try {
    const hashed_password = bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      `
        INSERT INTO users
        email, password VALUES($1, $2) RETURNING *;
        `,
      [email, hashed_password],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Couldn't process the signup", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default app;
