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

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({
      message: "Email and password are required to sign in",
    });
  }

  try {
    const result = await pool.query(`
        SELECT email, password FROM users
        `);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Couldn't process sign in", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.patch("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const result = await pool.query(
      `
        UPDATE users
        SET password = $1
        WHERE id = $2
        RETURNING *;
        `,
      [password, id],
    );

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Couldn't update the password", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

app.delete("/api/deleteUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            DELETE FROM users
            WHERE id = $1
            RETURNING *;
            `,
      [id],
    );

    res.status(200).json({
      message: "Delete user successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Couldn't delete the user", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default app;
